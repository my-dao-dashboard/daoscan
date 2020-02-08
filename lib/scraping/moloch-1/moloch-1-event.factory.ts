import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { Moloch1OrganisationCreatedEventFactory } from "./moloch-1-organisation-created-event.factory";

@Service(Moloch1EventFactory.name)
export class Moloch1EventFactory {
  constructor(
    @Inject(Moloch1OrganisationCreatedEventFactory.name)
    private readonly organisationCreated: Moloch1OrganisationCreatedEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreated.fromBlock(block);

    let result = new Array<ScrapingEvent>();
    return result.concat(organisationCreatedEvents);
  }
}
