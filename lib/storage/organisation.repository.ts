import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Organisation } from "./organisation.row";
import { PLATFORM } from "../domain/platform";
import { LessThan, LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder } from "typeorm";
import { DateTime } from "luxon";

type Cursor = { id: bigint; createdAt: DateTime };

class PaginationQuery {
  private readonly alias = this.query.alias;

  constructor(readonly query: SelectQueryBuilder<Organisation>) {}

  static build(repository: Repository<Organisation>) {
    const query = repository.createQueryBuilder("org").orderBy({
      "org.createdAt": "DESC",
      "org.id": "DESC"
    });
    return new PaginationQuery(query);
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
    return new PaginationQuery(next);
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
    return new PaginationQuery(next);
  }

  skip(n: number) {
    const next = this.query.clone().skip(n);
    return new PaginationQuery(next);
  }

  take(n: number) {
    const next = this.query.clone().take(n);
    return new PaginationQuery(next);
  }

  getCount() {
    return this.query.getCount();
  }

  getMany() {
    return this.query.getMany();
  }
}

@Service(OrganisationRepository.name)
export class OrganisationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byAddress(address: string) {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.findOne({
      address: address
    });
  }

  async first(n: number, cursor?: Cursor) {
    const repository = await this.repositoryFactory.reading(Organisation);
    let query = PaginationQuery.build(repository);
    const totalCount = await query.getCount();
    if (cursor) {
      query = query.after(cursor, false);
    }
    const afterCount = await query.getCount();
    const entries = await query.take(n).getMany();
    const startIndex = totalCount - afterCount + 1;
    const endIndex = startIndex + entries.length -1 ;
    return {
      startIndex: startIndex,
      endIndex: endIndex,
      hasNextPage: afterCount > n,
      hasPreviousPage: startIndex > 0,
      entries: entries
    };
  }

  async last(n: number, cursor: Cursor) {
    const repository = await this.repositoryFactory.reading(Organisation);
    const query = PaginationQuery.build(repository);
    const before = query.before(cursor, false);

    const beforeCount = await before.getCount();
    const afterCount = await query.after(cursor, true).getCount();

    const offset = beforeCount - n > 0 ? beforeCount - n : 0;

    const entries = await before
      .skip(offset)
      .take(n)
      .getMany();
    return {
      startIndex: beforeCount,
      endIndex: afterCount,
      hasPreviousPage: offset > 0,
      hasNextPage: afterCount > 0,
      entries: entries
    };
  }

  async count() {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.count();
  }

  async oldOnes(take: number) {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.find({
      where: {
        createdAt: LessThan(DateTime.fromISO("1980-01-01"))
      },
      take: take
    });
  }

  async uniq() {
    const repository = await this.repositoryFactory.reading(Organisation);
    const raw = await repository
      .createQueryBuilder("organisation")
      .select('count(distinct ("address"))', "count")
      .getRawOne();
    return Number(raw.count);
  }

  async save(row: Organisation): Promise<void> {
    const repository = await this.repositoryFactory.writing(Organisation);
    await repository.save(row);
  }

  async all(platform: PLATFORM): Promise<Organisation[]> {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository
      .createQueryBuilder("organisation")
      .where({ platform })
      .addOrderBy("organisation.id", "DESC")
      .getMany();
  }

  async byId(id: bigint) {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.findOne({ id: id });
  }
}
