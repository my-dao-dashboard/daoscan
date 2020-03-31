import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { OrganisationRecord } from "./organisation.record";
import { PLATFORM } from "../domain/platform";
import { OrganisationConnectionCursor } from "./organisation-connection.cursor";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { ConnectionQuery } from "./connection-query";

@Service(OrganisationStorage.name)
export class OrganisationStorage {
  readonly reading = this.repositoryFactory.reading(OrganisationRecord);
  readonly writing = this.repositoryFactory.writing(OrganisationRecord);

  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byAddress(address: string): Promise<OrganisationRecord | undefined> {
    const repository = await this.reading;
    return repository.findOne({
      address: address
    });
  }

  async connectionQuery() {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    const query = repository.createQueryBuilder("org").orderBy({
      "org.createdAt": "DESC",
      "org.id": "DESC"
    });
    return new ConnectionQuery<OrganisationRecord, OrganisationConnectionCursor>(
      query,
      (query, cursor, include) => {
        const cmp = include ? ">=" : ">";
        return query
          .clone()
          .where({ createdAt: MoreThanOrEqual(cursor.createdAt) })
          .andWhere(`(${query.alias}.createdAt ${cmp} :createdAt OR ${query.alias}.id ${cmp} :id)`, {
            createdAt: cursor.createdAt.toISOString(),
            id: cursor.id.toString()
          });
      },
      (query, cursor, include) => {
        const cmp = include ? "<=" : "<";
        return query
          .clone()
          .where({ createdAt: LessThanOrEqual(cursor.createdAt) })
          .andWhere(`(${query.alias}.createdAt ${cmp} :createdAt OR ${query.alias}.id ${cmp} :id)`, {
            createdAt: cursor.createdAt.toISOString(),
            id: cursor.id.toString()
          });
      }
    );
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

  async all(platform: PLATFORM): Promise<OrganisationRecord[]> {
    const repository = await this.repositoryFactory.reading(OrganisationRecord);
    return repository
      .createQueryBuilder("organisation")
      .where({ platform })
      .addOrderBy("organisation.id", "DESC")
      .getMany();
  }
}
