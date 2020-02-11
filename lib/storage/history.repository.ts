import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";

@Service(HistoryRepository.name)
export class HistoryRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}
}
