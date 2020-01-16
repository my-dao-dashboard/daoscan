import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { OrganisationCreatedEventRow } from "./organisation-created-event.row";

@Service(OrganisationCreatedEventRowRepository.name)
export class OrganisationCreatedEventRowRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async save(row: OrganisationCreatedEventRow) {
    const repository = await this.repositoryFactory.writing(OrganisationCreatedEventRow);
    await repository.save(row);
  }
}
