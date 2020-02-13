import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";

@Service(DelegateRepository.name)
export class DelegateRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}
}
