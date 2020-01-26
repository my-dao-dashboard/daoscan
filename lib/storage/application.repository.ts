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

  async byId(id: string): Promise<Application | undefined> {
    const repository = await this.repositoryFactory.writing(Application);
    return repository.findOne({ id });
  }
}
