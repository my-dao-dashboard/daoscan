import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Organisation } from "./organisation.row";

@Service(OrganisationRepository.name)
export class OrganisationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async save(row: Organisation): Promise<void> {
    const repository = await this.repositoryFactory.writing(Organisation);
    await repository.save(row);
  }
}
