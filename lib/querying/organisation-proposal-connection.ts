import { IPagination } from "./pagination.interface";
import { ProposalRepository } from "../storage/proposal.repository";
import { Organisation } from "../domain/organisation";
import { Mutex } from "await-semaphore/index";
import { Proposal } from "../storage/proposal.row";

const DEFAULT_PAGE = 25;

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
  entries: Proposal[];
  hasNextPage: boolean;
  endIndex: number;
  hasPreviousPage: boolean;
}

export class OrganisationProposalConnection {
  private rowsMutex = new Mutex();
  private cached: Raw | undefined;

  constructor(
    private readonly organisation: Organisation,
    private readonly pagination: IPagination,
    private readonly proposalRepository: ProposalRepository
  ) {}

  totalCount(): Promise<number> {
    return this.proposalRepository.countByOrganisation(this.organisation.address);
  }

  async edges() {
    const page = await this.page();
    return page.entries.map(proposal => {
      return {
        node: {
          createdAt: "FIXME",
          index: proposal.index,
          payload: proposal.payload,
          proposer: proposal.proposer,
          status: proposal.status
        },
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
    return this.rowsMutex.use(async () => {
      if (this.cached) {
        return this.cached;
      } else {
        this.cached = await this._page();
        return this.cached;
      }
    });
  }

  async _page(): Promise<Raw> {
    if (this.pagination.before) {
      const last = this.pagination.last || DEFAULT_PAGE;
      const before = decodeCursor(this.pagination.before);
      return this.proposalRepository.last(this.organisation.address, last, before);
    } else {
      const first = this.pagination.first || DEFAULT_PAGE;
      const after = this.pagination.after ? decodeCursor(this.pagination.after) : undefined;
      return this.proposalRepository.first(this.organisation.address, first, after);
    }
  }
}
