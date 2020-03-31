import { IPagination } from "./pagination.interface";
import { ProposalRepository } from "../storage/proposal.repository";
import { Organisation } from "../domain/organisation";
import { Mutex } from "await-semaphore/index";
import { ProposalRecord as ProposalRow } from "../storage/proposal.record";
import { ProposalFactory } from "../domain/proposal.factory";

const DEFAULT_PAGE_SIZE = 25;

function proposalToCursor(proposal: { index: number }) {
  const payload = { index: proposal.index };
  const string = JSON.stringify(payload);
  return Buffer.from(string).toString("base64");
}

function decodeCursor(cursor: string) {
  const buffer = Buffer.from(cursor, "base64").toString();
  const payload = JSON.parse(buffer);
  return {
    index: Number(payload.index)
  };
}

interface Raw {
  startIndex: number;
  entries: ProposalRow[];
  hasNextPage: boolean;
  endIndex: number;
  hasPreviousPage: boolean;
}

export class OrganisationProposalConnection {
  private pageMutex = new Mutex();
  private _pageCached: Raw | undefined;

  constructor(
    private readonly organisation: Organisation,
    private readonly pagination: IPagination,
    private readonly proposalRepository: ProposalRepository,
    private readonly proposalFactory: ProposalFactory
  ) {}

  totalCount(): Promise<number> {
    return this.proposalRepository.countByOrganisation(this.organisation.address);
  }

  async edges() {
    const page = await this.page();
    return page.entries.map(row => {
      const proposal = this.proposalFactory.fromRow(row);
      return {
        node: proposal,
        cursor: proposalToCursor(proposal)
      };
    });
  }

  async pageInfo() {
    const page = await this.page();
    const lastEdge = page.entries[page.entries.length - 1];
    const firstEdge = page.entries[0];
    const startCursor = firstEdge ? proposalToCursor(firstEdge) : null;
    const endCursor = lastEdge ? proposalToCursor(lastEdge) : null;
    return {
      endCursor: endCursor,
      startCursor: startCursor,
      hasNextPage: page.hasNextPage,
      hasPreviousPage: page.hasPreviousPage,
      startIndex: page.startIndex,
      endIndex: page.endIndex
    };
  }

  async page() {
    return this.pageMutex.use(async () => {
      if (this._pageCached) {
        return this._pageCached;
      } else {
        this._pageCached = await this._page();
        return this._pageCached;
      }
    });
  }

  async _page(): Promise<Raw> {
    if (this.pagination.before) {
      const last = this.pagination.last || DEFAULT_PAGE_SIZE;
      const before = decodeCursor(this.pagination.before);
      return this.proposalRepository.last(this.organisation.address, last, before);
    } else {
      const first = this.pagination.first || DEFAULT_PAGE_SIZE;
      const after = this.pagination.after ? decodeCursor(this.pagination.after) : undefined;
      return this.proposalRepository.first(this.organisation.address, first, after);
    }
  }
}
