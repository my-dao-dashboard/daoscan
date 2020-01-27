import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "./scraping-event";
import { AragonEventFactory } from "../aragon/aragon-event.factory";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { UnreachableCaseError } from "../../shared/unreachable-case-error";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationCreatedEventFactory } from "../aragon/organisation-created-event.factory";
import { AppInstalledEventFactory } from "../aragon/app-installed-event.factory";
import { ShareTransferEventFactory } from "../aragon/share-transfer-event.factory";
import { UUID } from "../../storage/uuid";

@Service(ScrapingEventFactory.name)
export class ScrapingEventFactory {
  constructor(
    @Inject(AragonEventFactory.name) private readonly aragon: AragonEventFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationCreatedEventFactory.name) private readonly organisationCreated: OrganisationCreatedEventFactory,
    @Inject(AppInstalledEventFactory.name) private readonly appInstalled: AppInstalledEventFactory,
    @Inject(ShareTransferEventFactory.name) private readonly shareTransfer: ShareTransferEventFactory
  ) {}

  async fromStorage(eventId: string): Promise<ScrapingEvent | undefined> {
    const row = await this.eventRepository.byId(new UUID(eventId));
    if (row) {
      const payload = row.payload;
      return this.fromJSON(payload);
    } else {
      return undefined;
    }
  }

  fromJSON(json: ScrapingEvent): ScrapingEvent {
    switch (json.kind) {
      case SCRAPING_EVENT_KIND.APP_INSTALLED:
        return this.appInstalled.fromJSON(json);
      case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
        return this.organisationCreated.fromJSON(json);
      case SCRAPING_EVENT_KIND.SHARE_TRANSFER:
        return this.shareTransfer.fromJSON(json);
      default:
        throw new UnreachableCaseError(json);
    }
  }

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const aragonEvents = await this.aragon.fromBlock(block);
    return aragonEvents;
  }
}
