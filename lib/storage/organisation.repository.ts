import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Organisation } from "./organisation.row";
import { UUID } from "./uuid";

@Service(OrganisationRepository.name)
export class OrganisationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byAddress(address: string) {
    const repository = await this.repositoryFactory.reading(Organisation)
    return repository.findOne({
      address: address
    })
  }

  async save(row: Organisation): Promise<void> {
    const repository = await this.repositoryFactory.writing(Organisation);
    await repository.save(row);
  }

  async byId(id: UUID): Promise<Organisation | undefined> {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.findOne({ id });
  }
}
