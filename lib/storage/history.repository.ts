import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { History } from "./history.row";

@Service(HistoryRepository.name)
export class HistoryRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byEventId(eventId: bigint): Promise<History[]> {
    const repository = await this.repositoryFactory.reading(History);
    return repository.find({
      eventId: eventId
    });
  }
}
