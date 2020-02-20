import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Membership } from "./membership.row";
import { QueryBuilder } from "typeorm";

function participantsQuery(
  qb: QueryBuilder<Membership>,
  alias: string,
  organisationAddress: string,
  after?: string,
  first?: number
) {
  let query = qb
    .select(`${alias}.accountAddress`, "accountAddress")
    .where(`${alias}.organisationAddress = :organisationAddress`, { organisationAddress: organisationAddress })
    .groupBy(`${alias}.accountAddress`)
    .orderBy(`${alias}.accountAddress`, "ASC");
  if (first) {
    query = query.limit(first);
  }
  if (after) {
    query = query.andWhere(`${alias}.accountAddress > :after`, { after: after });
  }
  return query;
}

@Service(MembershipRepository.name)
export class MembershipRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async membershipsCount(): Promise<number> {
    const repository = await this.repositoryFactory.reading(Membership);
    const raw = await repository
      .createQueryBuilder("membership")
      .select('count(distinct ("accountAddress", "organisationAddress"))', "count")
      .getRawOne();
    return Number(raw.count);
  }

  async participantsCount(): Promise<number> {
    const repository = await this.repositoryFactory.reading(Membership);
    const raw = await repository
      .createQueryBuilder("membership")
      .select('COUNT(DISTINCT("accountAddress"))', "count")
      .getRawOne();
    return Number(raw.count);
  }

  async allOrganisationAddresses(accountAddress: string) {
    const membershipRepository = await this.repositoryFactory.reading(Membership);
    const records = await membershipRepository
      .createQueryBuilder("membership")
      .where("membership.accountAddress = :accountAddress", { accountAddress: accountAddress })
      .groupBy("membership.organisationAddress")
      .select("membership.organisationAddress", "organisationAddress")
      .getRawMany();
    return records.map(r => r.organisationAddress);
  }

  async countByOrganisationAddress(organisationAddress: string) {
    const repository = await this.repositoryFactory.reading(Membership);
    const raw = await repository
      .createQueryBuilder("membership")
      .select('count(distinct ("accountAddress"))', "count")
      .where("membership.organisationAddress = :organisationAddress", { organisationAddress })
      .getRawOne();
    return Number(raw.count);
  }

  async allByOrganisationAddress(
    organisationAddress: string,
    first: number,
    after: string | undefined
  ): Promise<string[]> {
    const repository = await this.repositoryFactory.reading(Membership);
    const queryBuilder = repository.createQueryBuilder("m");
    const query = participantsQuery(queryBuilder, "m", organisationAddress, after, first);
    const records = await query.getRawMany();
    return records.map(r => r.accountAddress);
  }

  async hasMoreByOrganisationAddress(organisationAddress: string, afterAddress: string): Promise<number> {
    const repository = await this.repositoryFactory.reading(Membership);
    const qq = repository.manager
      .createQueryBuilder()
      .select("COUNT(*)")
      .from(qb => {
        return participantsQuery(qb.from("memberships", "m"), "m", organisationAddress, afterAddress);
      }, "participants");
    const result = await qq.getRawOne();
    return Number(result.count);
  }

  async byAddressInOrganisation(organisationAddress: string, accountAddress: string): Promise<Membership | undefined> {
    const repository = await this.repositoryFactory.reading(Membership);
    return repository.findOne({
      organisationAddress: organisationAddress,
      accountAddress: accountAddress
    });
  }
}
