import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Application } from "./application.row";
import { UUID } from "./uuid";
import { APP_ID } from "./app-id";

@Service(ApplicationRepository.name)
export class ApplicationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async organisationAddressByApplicationAddress(address: string, appId: APP_ID): Promise<string | undefined> {
    const repository = await this.repositoryFactory.reading(Application);
    const applicationRow = await repository.findOne({
      address: address,
      appId: appId
    });
    if (applicationRow) {
      return applicationRow.organisationAddress;
    } else {
      return undefined;
    }
  }

  async tokenAddress(organisationAddress: string): Promise<string | undefined> {
    const repository = await this.repositoryFactory.reading(Application);
    const application = await repository.findOne({
      organisationAddress: organisationAddress.toLowerCase(),
      appId: APP_ID.SHARE
    });
    if (application) {
      return application.address;
    }
  }

  async bankAddress(organisationAddress: string): Promise<string | undefined> {
    const repository = await this.repositoryFactory.reading(Application);
    const application = await repository.findOne({
      organisationAddress: organisationAddress,
      appId: APP_ID.ARAGON_VAULT
    });
    if (application) {
      return application.address;
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
