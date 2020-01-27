import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { OrganisationCreatedEventFactory } from "./organisation-created-event.factory";
import { AppInstalledEventFactory } from "./app-installed-event.factory";
import { ShareTransferEventFactory } from "./share-transfer-event.factory";

@Service(AragonEventFactory.name)
export class AragonEventFactory {
  constructor(
    @Inject(OrganisationCreatedEventFactory.name) private readonly organisationCreated: OrganisationCreatedEventFactory,
    @Inject(AppInstalledEventFactory.name) private readonly appInstalled: AppInstalledEventFactory,
    @Inject(ShareTransferEventFactory.name) private readonly shareTransfer: ShareTransferEventFactory
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreated.fromBlock(block);
    const appInstalledEvents = await this.appInstalled.fromBlock(block);
    const shareTransferEvents = await this.shareTransfer.fromBlock(block, appInstalledEvents);

    let result = new Array<ScrapingEvent>();
    return result
      .concat(organisationCreatedEvents)
      .concat(appInstalledEvents)
      .concat(shareTransferEvents);
  }
}
