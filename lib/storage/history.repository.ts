import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { History } from "./history.row";
import { RESOURCE_KIND } from "./resource.kind";

@Service(HistoryRepository.name)
export class HistoryRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async allByEventId(eventId: bigint, resourceKind: RESOURCE_KIND): Promise<History[]> {
    const repository = await this.repositoryFactory.reading(History);
    return repository.find({
      eventId: eventId,
      resourceKind
    });
  }
}
