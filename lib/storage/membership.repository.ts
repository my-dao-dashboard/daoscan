import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Membership } from "./membership.row";
import { UUID } from "./uuid";

@Service(MembershipRepository.name)
export class MembershipRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async allOrganisationAddresses(accountId: string) {
    const membershipRepository = await this.repositoryFactory.reading(Membership)
    const organisationAddresses = await membershipRepository.createQueryBuilder('membership')
      .where('membership.accountId = :accountId', {accountId})
      .groupBy('membership.organisationId')
      .select('membership.organisationId')
      .getRawMany()
    console.log('organisationAddresses', organisationAddresses)
  }

  async byEventId(eventId: UUID): Promise<Membership[]> {
    const repository = await this.repositoryFactory.reading(Membership);
    return repository.find({
      eventId: eventId
    });
  }
}
