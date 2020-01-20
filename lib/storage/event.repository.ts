import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Event } from "./event.row";

@Service(EventRepository.name)
export class EventRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byId(id: string): Promise<Event | undefined> {
    const repository = await this.repositoryFactory.reading(Event);
    return repository.findOne({ id });
  }

  async findSame(event: Event): Promise<Event | undefined> {
    const repository = await this.repositoryFactory.reading(Event);
    return repository.findOne({
      platform: event.platform,
      blockHash: event.blockHash,
      blockId: event.blockId,
      payload: event.payload
    });
  }

  async allForBlock(blockId: bigint, blockHash: string): Promise<Event[]> {
    const repository = await this.repositoryFactory.reading(Event);
    return repository.find({ blockId, blockHash });
  }
}
