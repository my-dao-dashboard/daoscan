import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { OrganisationRow } from "./organisation.row";

@Service(OrganisationRowRepository.name)
export class OrganisationRowRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async save(row: OrganisationRow) {
    const repository = await this.repositoryFactory.writing(OrganisationRow);
    await repository.save(row);
  }
}
