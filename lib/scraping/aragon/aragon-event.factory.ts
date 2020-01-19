import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { OrganisationCreatedEventFactory } from "./organisation-created-event.factory";

@Service(AragonEventFactory.name)
export class AragonEventFactory {
  constructor(
    @Inject(OrganisationCreatedEventFactory.name)
    private readonly organisationCreatedEventFactory: OrganisationCreatedEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreatedEventFactory.fromBlock(block);
    return organisationCreatedEvents;
  }
}
