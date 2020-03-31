import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { OrganisationRecord } from "./organisation.record";
import { PLATFORM } from "../domain/platform";
import { LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder } from "typeorm";
import { DateTime } from "luxon";
import { IPage } from "./page.interface";

type Cursor = { id: bigint; createdAt: DateTime };

class ConnectionQuery {
  private readonly alias = this.query.alias;

  constructor(readonly query: SelectQueryBuilder<OrganisationRecord>) {}

  static build(repository: Repository<OrganisationRecord>) {
    const query = repository.createQueryBuilder("org").orderBy({
      "org.createdAt": "DESC",
      "org.id": "DESC"
    });
    return new ConnectionQuery(query);
  }

  before(cursor: Cursor, include: boolean) {
    const cmp = include ? ">=" : ">";
    const next = this.query
      .clone()
      .where({ createdAt: MoreThanOrEqual(cursor.createdAt) })
      .andWhere(`(${this.alias}.createdAt ${cmp} :createdAt OR ${this.alias}.id ${cmp} :id)`, {
        createdAt: cursor.createdAt.toISO(),
        id: cursor.id.toString()
      });
    return new ConnectionQuery(next);
  }

  after(cursor: Cursor, include: boolean) {
    const cmp = include ? "<=" : "<";
    const next = this.query
      .clone()
      .where({ createdAt: LessThanOrEqual(cursor.createdAt) })
      .andWhere(`(${this.alias}.createdAt ${cmp} :createdAt OR ${this.alias}.id ${cmp} :id)`, {
        createdAt: cursor.createdAt.toISO(),
        id: cursor.id.toString()
      });
    return new ConnectionQuery(next);
  }

  skip(n: number) {
    const next = this.query.clone().skip(n);
    return new ConnectionQuery(next);
  }

  take(n: number) {
    const next = this.query.clone().take(n);
    return new ConnectionQuery(next);
  }

  getCount() {
    return this.query.getCount();
  }

  getMany() {
    return this.query.getMany();
  }
}

@Service(OrganisationStorage.name)
export class OrganisationStorage {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byAddress(address: string) {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    return repository.findOne({
      address: address
    });
  }

  async first(n: number, cursor?: Cursor): Promise<IPage<OrganisationRecord>> {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    let query = ConnectionQuery.build(repository);
    const totalCount = await query.getCount();
    if (cursor) {
      query = query.after(cursor, false);
    }
    const afterCount = await query.getCount();
    const entries = await query.take(n).getMany();
    const startIndex = totalCount - afterCount + 1;
    const endIndex = startIndex + entries.length - 1;
    return {
      startIndex: startIndex,
      endIndex: endIndex,
      hasNextPage: afterCount > n,
      hasPreviousPage: startIndex > 1,
      entries: entries
    };
  }

  async last(n: number, cursor: Cursor) {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    const query = ConnectionQuery.build(repository);
    const totalCount = await query.getCount();
    const before = query.before(cursor, false);

    const beforeCount = await before.getCount();
    const offset = beforeCount - n > 0 ? beforeCount - n : 0;

    const entries = await before
      .skip(offset)
      .take(n)
      .getMany();

    const startIndex = beforeCount - n + 1;
    const endIndex = startIndex + n - 1;
    const afterCount = totalCount - offset - n;

    return {
      startIndex: startIndex,
      endIndex: endIndex,
      hasPreviousPage: offset > 0,
      hasNextPage: afterCount > 0,
      entries: entries
    };
  }

  async count() {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    return repository.count();
  }

  async uniq() {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    const raw = await repository
      .createQueryBuilder("organisation")
      .select('count(distinct ("address"))', "count")
      .getRawOne();
    return Number(raw.count);
  }

  async save(row: OrganisationRecord): Promise<void> {
    const repository = await this.repositoryFactory.writing(OrganisationRecord);
    await repository.save(row);
  }

  async all(platform: PLATFORM): Promise<OrganisationRecord[]> {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    return repository
      .createQueryBuilder("organisation")
      .where({ platform })
      .addOrderBy("organisation.id", "DESC")
      .getMany();
  }

  async byId(id: bigint) {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    return repository.findOne({ id: id });
  }
}
