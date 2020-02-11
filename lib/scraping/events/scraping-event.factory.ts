import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "./scraping-event";
import { AragonEventFactory } from "../aragon/aragon-event.factory";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { UnreachableCaseError } from "../../shared/unreachable-case-error";
import { EventRepository } from "../../storage/event.repository";
import { UUID } from "../../storage/uuid";
import { Moloch1EventFactory } from "../moloch-1/moloch-1-event.factory";
import { AppInstalledEvent } from "./app-installed.event";
import { ApplicationRepository } from "../../storage/application.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { OrganisationCreatedEvent } from "./organisation-created.event";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { ShareTransferEvent } from "./share-transfer.event";
import { MembershipRepository } from "../../storage/membership.repository";
import { AddDelegateEvent } from "./add-delegate.event";
import { DelegateRepository } from "../../storage/delegate.repository";
import { HistoryRepository } from "../../storage/history.repository";

@Service(ScrapingEventFactory.name)
export class ScrapingEventFactory {
  constructor(
    @Inject(AragonEventFactory.name) private readonly aragon: AragonEventFactory,
    @Inject(Moloch1EventFactory.name) private readonly moloch: Moloch1EventFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository,
    @Inject(DelegateRepository.name) private readonly delegateRepository: DelegateRepository,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(HistoryRepository.name) private readonly historyRepository: HistoryRepository
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
        return new AppInstalledEvent(
          json,
          this.eventRepository,
          this.applicationRepository,
          this.historyRepository,
          this.connectionFactory
        );
      case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
        return new OrganisationCreatedEvent(
          json,
          this.eventRepository,
          this.organisationRepository,
          this.historyRepository,
          this.connectionFactory
        );
      case SCRAPING_EVENT_KIND.SHARE_TRANSFER:
        return new ShareTransferEvent(
          json,
          this.eventRepository,
          this.membershipRepository,
          this.historyRepository,
          this.connectionFactory
        );
      case SCRAPING_EVENT_KIND.ADD_DELEGATE:
        return new AddDelegateEvent(
          json,
          this.connectionFactory,
          this.eventRepository,
          this.delegateRepository,
          this.historyRepository
        );
      default:
        throw new UnreachableCaseError(json);
    }
  }

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const aragonEvents = await this.aragon.fromBlock(block);
    // TODO Moloch
    // const molochEvents = await this.moloch.fromBlock(block);
    // return aragonEvents.concat(molochEvents);
    return aragonEvents;
  }
}
