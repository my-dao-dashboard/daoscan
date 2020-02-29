import { IPagination } from "./pagination.interface";
import { OrganisationRepository } from "../storage/organisation.repository";
import { Mutex } from "await-semaphore/index";
import { OrganisationFactory } from "../domain/organisation.factory";
import { DateTime } from "luxon";
import { Organisation as OrganisationRow } from "../storage/organisation.row";

function organisationToCursor(organisation: { id: bigint; createdAt: string | DateTime }) {
  const payload = { id: organisation.id.toString(), createdAt: organisation.createdAt.toString() };
  const string = JSON.stringify(payload);
  return Buffer.from(string).toString("base64");
}

function decodeCursor(cursor: string) {
  const buffer = Buffer.from(cursor, "base64").toString();
  const payload = JSON.parse(buffer);
  return {
    id: BigInt(payload.id),
    createdAt: DateTime.fromISO(payload.createdAt)
  };
}

const DEFAULT_PAGE = 25;

export class OrganisationConnection {
  private _rows:
    | {
        startIndex: number;
        endIndex: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        entries: OrganisationRow[];
      }
    | undefined;
  private rowsMutex = new Mutex();

  constructor(
    private readonly pagination: IPagination,
    private readonly organisationRepository: OrganisationRepository,
    private readonly organisationFactory: OrganisationFactory
  ) {}

  async totalCount() {
    return this.organisationRepository.count();
  }

  async pageInfo() {
    const rows = await this.organisationRows();
    const lastEdge = rows.entries[rows.entries.length - 1];
    const firstEdge = rows.entries[0];
    const startCursor = firstEdge ? organisationToCursor(firstEdge) : null;
    const endCursor = lastEdge ? organisationToCursor(lastEdge) : null;
    const result = {
      endCursor: endCursor,
      startCursor: startCursor,
      hasNextPage: rows.hasNextPage,
      hasPreviousPage: rows.hasPreviousPage,
      startIndex: rows.startIndex,
      endIndex: rows.endIndex
    };
    return result;
  }

  async edges() {
    const rows = await this.organisationRows();
    return rows.entries.map(row => {
      const organisation = this.organisationFactory.fromRow(row);
      return {
        node: organisation,
        cursor: organisationToCursor(organisation)
      };
    });
  }

  async organisationRows() {
    return this.rowsMutex.use(async () => {
      if (this._rows) {
        return this._rows;
      } else {
        this._rows = await this._organisationRows();
        return this._rows;
      }
    });
  }

  async _organisationRows() {
    if (this.pagination.before) {
      const last = this.pagination.last || DEFAULT_PAGE;
      const before = decodeCursor(this.pagination.before);
      return this.organisationRepository.last(last, before);
    } else {
      const first = this.pagination.first || DEFAULT_PAGE;
      const after = this.pagination.after ? decodeCursor(this.pagination.after) : undefined;
      return this.organisationRepository.first(first, after);
    }
  }
}
