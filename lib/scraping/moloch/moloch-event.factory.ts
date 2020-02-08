import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { MolochOrganisationCreatedEventFactory } from "./moloch-organisation-created-event.factory";

@Service(MolochEventFactory.name)
export class MolochEventFactory {
  constructor(
    @Inject(MolochOrganisationCreatedEventFactory.name)
    private readonly organisationCreated: MolochOrganisationCreatedEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreated.fromBlock(block);

    let result = new Array<ScrapingEvent>();
    return result.concat(organisationCreatedEvents);
  }
}
