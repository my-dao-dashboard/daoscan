import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Event } from "./event.row";
import { UUID } from "./uuid";

@Service(EventRepository.name)
export class EventRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byId(id: UUID): Promise<Event | undefined> {
    const repository = await this.repositoryFactory.reading(Event);
    return repository.findOne({ id });
  }

  async save(event: Event) {
    const repository = await this.repositoryFactory.writing(Event);
    return repository.save(event);
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

  async oldOnes(limit: number) {
    const eventRepository = await this.repositoryFactory.reading(Event);
    return eventRepository
      .createQueryBuilder("event")
      .where('event.serialId NOT IN (SELECT "eventId" from history)')
      .limit(limit)
      .addOrderBy('"blockId"', "ASC")
      .getMany();
  }
}
