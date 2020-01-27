import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Application } from "./application.row";

@Service(ApplicationRepository.name)
export class ApplicationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async save(row: Application): Promise<void> {
    const repository = await this.repositoryFactory.writing(Application);
    await repository.save(row);
  }

  async organisationAddressByApplicationAddress(proxyAddress: string): Promise<string | undefined> {
    const repository = await this.repositoryFactory.reading(Application);
    const applicationRow = await repository.findOne({
      id: proxyAddress
    });
    if (applicationRow) {
      return applicationRow.organisationId;
    } else {
      return undefined;
    }
  }

  async byId(id: string): Promise<Application | undefined> {
    const repository = await this.repositoryFactory.writing(Application);
    return repository.findOne({ id });
  }
}
