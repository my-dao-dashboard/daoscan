import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Membership } from "./membership.row";
import { UUID } from "./uuid";

@Service(MembershipRepository.name)
export class MembershipRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byEventId(eventId: UUID): Promise<Membership[]> {
    const repository = await this.repositoryFactory.reading(Membership);
    return repository.find({
      eventId: eventId
    });
  }

  async delete(id: UUID) {
    const repository = await this.repositoryFactory.writing(Membership);
    return repository.delete({ id });
  }

  async findSame(row: Membership) {
    const repository = await this.repositoryFactory.reading(Membership);
    return repository.findOne({
      accountId: row.accountId,
      organisationId: row.organisationId,
      balanceDelta: row.balanceDelta,
      kind: row.kind
    });
  }
}
