import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "./scraping-event";
import { AragonEventFactory } from "../aragon/aragon-event.factory";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { UnreachableCaseError } from "../../shared/unreachable-case-error";
import { EventRepository } from "../../storage/event.repository";
import { AragonOrganisationCreatedEventFactory } from "../aragon/aragon-organisation-created-event.factory";
import { AragonAppInstalledEventFactory } from "../aragon/aragon-app-installed-event.factory";
import { AragonShareTransferEventFactory } from "../aragon/aragon-share-transfer-event.factory";
import { UUID } from "../../storage/uuid";
import { Moloch1EventFactory } from "../moloch-1/moloch-1-event.factory";
import { NotImplementedError } from "../../shared/errors";
import {AppInstalledEvent} from "./app-installed.event";
import {ApplicationRepository} from "../../storage/application.repository";

@Service(ScrapingEventFactory.name)
export class ScrapingEventFactory {
  constructor(
    @Inject(AragonEventFactory.name) private readonly aragon: AragonEventFactory,
    @Inject(Moloch1EventFactory.name) private readonly moloch: Moloch1EventFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(AragonOrganisationCreatedEventFactory.name)
    private readonly organisationCreated: AragonOrganisationCreatedEventFactory,
    @Inject(AragonAppInstalledEventFactory.name) private readonly appInstalled: AragonAppInstalledEventFactory,
    @Inject(AragonShareTransferEventFactory.name) private readonly shareTransfer: AragonShareTransferEventFactory
  ) {}

  async fromStorage(eventId: UUID): Promise<ScrapingEvent | undefined> {
    const row = await this.eventRepository.byId(eventId);
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
      case SCRAPING_EVENT_KIND.ADD_DELEGATE:
        throw new NotImplementedError(`SCRAPING_EVENT_KIND.ADD_DELEGATE`);
      default:
        throw new UnreachableCaseError(json);
    }
  }

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const aragonEvents = await this.aragon.fromBlock(block);
    const molochEvents = await this.moloch.fromBlock(block);
    return aragonEvents.concat(molochEvents);
  }
}
