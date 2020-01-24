import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { OrganisationCreatedEventFactory } from "./organisation-created-event.factory";
import { AppInstalledEventFactory } from "./app-installed-event.factory";

@Service(AragonEventFactory.name)
export class AragonEventFactory {
  constructor(
    @Inject(OrganisationCreatedEventFactory.name)
    private readonly organisationCreatedEventFactory: OrganisationCreatedEventFactory,
    @Inject(AppInstalledEventFactory.name)
    private readonly appInstalledEventFactory: AppInstalledEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents: ScrapingEvent[] = await this.organisationCreatedEventFactory.fromBlock(block);
    const appInstalledEvents: ScrapingEvent[] = await this.appInstalledEventFactory.fromBlock(block);
    return organisationCreatedEvents.concat(appInstalledEvents);
  }
}
