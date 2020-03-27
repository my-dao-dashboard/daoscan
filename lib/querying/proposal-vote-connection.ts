import { Proposal } from "../domain/proposal";
import { IPagination } from "./pagination.interface";
import { VoteRepository } from "../storage/vote.repository";
import { TokenFactory } from "../domain/token.factory";
import { Mutex } from "await-semaphore";
import { Vote as VoteRow } from "../storage/vote.row";
import { VoteFactory } from "../domain/vote.factory";

const DEFAULT_PAGE_SIZE = 25;

function toCursor(cursor: { id: BigInt; createdAt: Date }) {
  const payload = { id: cursor.id.toString(), createdAt: cursor.createdAt.valueOf() };
  const string = JSON.stringify(payload);
  return Buffer.from(string).toString("base64");
}

function decodeCursor(cursor: string) {
  const buffer = Buffer.from(cursor, "base64").toString();
  const payload = JSON.parse(buffer);
  return {
    id: BigInt(payload.id),
    createdAt: new Date(payload.createdAt)
  };
}

export class ProposalVoteConnection {
  private readonly pagination: IPagination;
  private pageMutex = new Mutex();
  private _pageCache:
    | {
        startIndex: number;
        endIndex: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        entries: VoteRow[];
      }
    | undefined;

  constructor(
    readonly proposal: Proposal,
    page: IPagination | undefined,
    private readonly tokenFactory: TokenFactory,
    private readonly voteRepository: VoteRepository,
    private readonly voteFactory: VoteFactory
  ) {
    this.pagination = page || {};
  }

  async totalCount(): Promise<number> {
    return this.voteRepository.countByProposal(this.proposal);
  }

  async edges() {
    const rows = await this.page();
    const promised = rows.entries.map(async row => {
      const vote = await this.voteFactory.fromRow(row);
      return {
        node: vote,
        cursor: toCursor(row)
      };
    });
    return Promise.all(promised);
  }

  async pageInfo() {
    const rows = await this.page();
    const lastEdge = rows.entries[rows.entries.length - 1];
    const firstEdge = rows.entries[0];
    const startCursor = firstEdge ? toCursor(firstEdge) : null;
    const endCursor = lastEdge ? toCursor(lastEdge) : null;
    return {
      endCursor: endCursor,
      startCursor: startCursor,
      hasNextPage: rows.hasNextPage,
      hasPreviousPage: rows.hasPreviousPage,
      startIndex: rows.startIndex,
      endIndex: rows.endIndex
    };
  }

  async page() {
    return this.pageMutex.use(async () => {
      if (this._pageCache) {
        return this._pageCache;
      } else {
        this._pageCache = await this._page();
        return this._pageCache;
      }
    });
  }

  async _page() {
    if (this.pagination.before) {
      const last = this.pagination.last || DEFAULT_PAGE_SIZE;
      const before = decodeCursor(this.pagination.before);
      return this.voteRepository.last(this.proposal, last, before);
    } else {
      const first = this.pagination.first || DEFAULT_PAGE_SIZE;
      const after = this.pagination.after ? decodeCursor(this.pagination.after) : undefined;
      return this.voteRepository.first(this.proposal, first, after);
    }
  }
}
