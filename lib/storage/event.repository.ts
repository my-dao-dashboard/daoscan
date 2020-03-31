import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { EventRecord } from "./event.record";
import { In } from "typeorm";
import { SCRAPING_EVENT_KIND } from "../scraping/events/scraping-event.kind";

@Service(EventRepository.name)
export class EventRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byIdOrFail(id: bigint) {
    const repository = await this.repositoryFactory.reading(EventRecord);
    return repository.findOneOrFail({ id: id });
  }

  async allByIdKind(ids: bigint[], kind: SCRAPING_EVENT_KIND) {
    const repository = await this.repositoryFactory.reading(EventRecord);
    return repository.find({
      where: { id: In(ids.map(id => id.toString())), kind: kind },
      order: {
        timestamp: "DESC"
      },
      take: 1
    });
  }

  async allByIds(ids: bigint[]) {
    const repository = await this.repositoryFactory.reading(EventRecord);
    return repository.find({
      where: { id: In(ids.map(id => id.toString())) },
      order: {
        timestamp: "DESC"
      },
      take: 1
    });
  }

  async byId(id: bigint): Promise<EventRecord | undefined> {
    const repository = await this.repositoryFactory.reading(EventRecord);
    return repository.findOne({ id: id });
  }

  async save(event: EventRecord) {
    const repository = await this.repositoryFactory.writing(EventRecord);
    return repository.save(event);
  }

  async findSame(event: EventRecord): Promise<EventRecord | undefined> {
    const repository = await this.repositoryFactory.reading(EventRecord);
    return repository.findOne({
      platform: event.platform,
      blockHash: event.blockHash,
      blockId: event.blockId,
      payload: event.payload
    });
  }

  async allForBlock(blockId: bigint, blockHash: string): Promise<EventRecord[]> {
    const repository = await this.repositoryFactory.reading(EventRecord);
    return repository.find({ blockId, blockHash });
  }
}
