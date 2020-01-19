import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "./event";
import { AragonEventFactory } from "../aragon/aragon-event.factory";
import { StoredEvent } from "../command";

export interface IEventFactory {
  fromBlock(block: Block): Promise<ScrapingEvent[]>;
  fromStorage(storedEvent: StoredEvent): Promise<ScrapingEvent[]>;
}

@Service(EventFactory.name)
export class EventFactory implements IEventFactory {
  constructor(@Inject(AragonEventFactory.name) private readonly aragon: AragonEventFactory) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const aragonEvents = await this.aragon.fromBlock(block);
    return aragonEvents;
  }

  async fromStorage(storedEvent: StoredEvent): Promise<ScrapingEvent[]> {
    return [];
  }
}
