import { IPagination } from "./pagination.interface";
import { OrganisationStorage } from "../storage/organisation.storage";
import { Mutex } from "await-semaphore/index";
import { OrganisationFactory } from "../domain/organisation.factory";
import { OrganisationRecord } from "../storage/organisation.record";
import { OrganisationConnectionCursor } from "../storage/organisation-connection.cursor";
import { Page } from "../storage/page";

const DEFAULT_PAGE = 25;

export class OrganisationConnection {
  private _pageCache: Page<OrganisationRecord> | undefined;
  private pageMutex = new Mutex();

  constructor(
    private readonly pagination: IPagination,
    private readonly organisationStorage: OrganisationStorage,
    private readonly organisationFactory: OrganisationFactory
  ) {}

  async totalCount() {
    return this.organisationStorage.count();
  }

  async pageInfo() {
    const page = await this.page();
    const lastEdge = page.entries[page.entries.length - 1];
    const firstEdge = page.entries[0];
    const startCursor = firstEdge ? OrganisationConnectionCursor.build(firstEdge) : null;
    const endCursor = lastEdge ? OrganisationConnectionCursor.build(lastEdge) : null;
    return {
      endCursor: endCursor?.encode(),
      startCursor: startCursor?.encode(),
      hasNextPage: page.hasNextPage,
      hasPreviousPage: page.hasPreviousPage,
      startIndex: page.startIndex,
      endIndex: page.endIndex
    };
  }

  async edges() {
    const rows = await this.page();
    return rows.entries.map(row => {
      const organisation = this.organisationFactory.fromRecord(row);
      return {
        node: organisation,
        cursor: OrganisationConnectionCursor.build(organisation).encode()
      };
    });
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
    const query = await this.organisationStorage.connectionQuery();
    if (this.pagination.before) {
      const take = this.pagination.last || DEFAULT_PAGE;
      const before = OrganisationConnectionCursor.decode(this.pagination.before);
      return Page.before(query, take, before);
    } else {
      const take = this.pagination.first || DEFAULT_PAGE;
      const after = this.pagination.after ? OrganisationConnectionCursor.decode(this.pagination.after) : undefined;
      return Page.after(query, take, after);
    }
  }
}
