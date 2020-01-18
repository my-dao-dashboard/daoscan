import { Inject, Service } from "typedi";
import { Block } from "../block";
import { EventFactory, ScrapingEvent } from "../event";
import { OrganisationCreatedEventFactory } from "./organisation-created-event.factory";

@Service(AragonEventFactory.name)
export class AragonEventFactory implements EventFactory {
  constructor(
    @Inject(OrganisationCreatedEventFactory.name)
    private readonly organisationCreatedEventFactory: OrganisationCreatedEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreatedEventFactory.fromBlock(block);
    return organisationCreatedEvents;
  }
}
