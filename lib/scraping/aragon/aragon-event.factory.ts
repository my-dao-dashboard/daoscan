import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/event";
import { OrganisationCreatedEventFactory } from "./organisation-created-event.factory";
import { IEventFactory } from "../events/event.factory";
import {StoredEvent} from "../command";

@Service(AragonEventFactory.name)
export class AragonEventFactory implements IEventFactory {
  constructor(
    @Inject(OrganisationCreatedEventFactory.name)
    private readonly organisationCreatedEventFactory: OrganisationCreatedEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreatedEventFactory.fromBlock(block);
    return organisationCreatedEvents;
  }

  async fromStorage(storedEvent: StoredEvent): Promise<ScrapingEvent[]> {
    return []
  }
}
