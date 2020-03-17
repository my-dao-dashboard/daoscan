import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { AragonOrganisationCreatedEventFactory } from "./aragon-organisation-created-event.factory";
import { AragonAppInstalledEventFactory } from "./aragon-app-installed-event.factory";
import { AragonShareTransferEventFactory } from "./aragon-share-transfer-event.factory";
import { AragonSetOrganisationNameEventFactory } from "./aragon-set-organisation-name-event.factory";

@Service(AragonEventFactory.name)
export class AragonEventFactory {
  constructor(
    @Inject(AragonOrganisationCreatedEventFactory.name)
    private readonly organisationCreated: AragonOrganisationCreatedEventFactory,
    @Inject(AragonAppInstalledEventFactory.name) private readonly appInstalled: AragonAppInstalledEventFactory,
    @Inject(AragonShareTransferEventFactory.name) private readonly shareTransfer: AragonShareTransferEventFactory,
    @Inject(AragonSetOrganisationNameEventFactory.name) private readonly setName: AragonSetOrganisationNameEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreated.fromBlock(block);
    const appInstalledEvents = await this.appInstalled.fromBlock(block);
    const shareTransferEvents = await this.shareTransfer.fromBlock(block, appInstalledEvents);
    const setNames = await this.setName.fromBlock(block);
    const dedupeOrgCreation = organisationCreatedEvents.filter(e =>
      !organisationCreatedEvents.find(created => created.address.toLowerCase() === e.address.toLowerCase())
    );

    let result = new Array<ScrapingEvent>();
    return result
      .concat(setNames)
      .concat(appInstalledEvents)
      .concat(shareTransferEvents)
      .concat(dedupeOrgCreation);
  }
}
