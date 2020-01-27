import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Organisation } from "./organisation.row";
import { UUID } from "./uuid";

@Service(OrganisationRepository.name)
export class OrganisationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async save(row: Organisation): Promise<void> {
    const repository = await this.repositoryFactory.writing(Organisation);
    await repository.save(row);
  }

  async allByEventId(eventId: UUID) {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.find({ eventId: eventId });
  }

  async byId(id: string): Promise<Organisation | undefined> {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.findOne({ id });
  }
}
