import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "./scraping-event";
import { AragonEventFactory } from "../aragon/aragon-event.factory";

@Service(EventFactory.name)
export class EventFactory {
  constructor(@Inject(AragonEventFactory.name) private readonly aragon: AragonEventFactory) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const aragonEvents = await this.aragon.fromBlock(block);
    return aragonEvents;
  }
}
