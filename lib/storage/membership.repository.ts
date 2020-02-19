import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Membership } from "./membership.row";
import { MoreThan } from "typeorm";

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
    let query = repository
      .createQueryBuilder("membership")
      .where({ organisationAddress: organisationAddress })
      .groupBy("membership.accountAddress")
      .orderBy("membership.accountAddress", "ASC")
      .select("membership.accountAddress", "accountAddress")
      .limit(first);
    if (after) {
      query = query.andWhere("membership.accountAddress > :after", { after: after });
    }
    const records = await query.getRawMany();
    return records.map(r => r.accountAddress);
  }

  async byAddressInOrganisation(organisationAddress: string, accountAddress: string): Promise<Membership | undefined> {
    const repository = await this.repositoryFactory.reading(Membership);
    return repository.findOne({
      organisationAddress: organisationAddress,
      accountAddress: accountAddress
    });
  }
}
