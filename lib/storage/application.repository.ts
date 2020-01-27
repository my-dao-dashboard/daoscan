import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Application } from "./application.row";
import { UUID } from "./uuid";

@Service(ApplicationRepository.name)
export class ApplicationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async organisationAddressByApplicationAddress(address: string): Promise<string | undefined> {
    const repository = await this.repositoryFactory.reading(Application);
    const applicationRow = await repository.findOne({
      address: address
    });
    if (applicationRow) {
      return applicationRow.organisationAddress;
    } else {
      return undefined;
    }
  }

  async byAddress(address: string) {
    const repository = await this.repositoryFactory.reading(Application);
    return repository.findOne({ address });
  }

  async byId(id: UUID): Promise<Application | undefined> {
    const repository = await this.repositoryFactory.reading(Application);
    return repository.findOne({ id });
  }
}
