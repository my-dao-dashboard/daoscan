import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";

@Service(EventRepository.name)
export class EventRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}
}
