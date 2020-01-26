import { ScrapingEvent } from "./events/scraping-event";
import { COMMAND_KIND } from "./command.kind";
import { OrganisationCreatedEventDelta } from "./events/organisation-created-event.delta";
import { AppInstalledEventDelta } from "./events/app-installed-event.delta";
import { SCRAPING_EVENT_KIND } from "./events/scraping-event.kind";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { EventRepository } from "../storage/event.repository";

interface GenericCommand {
  readonly kind: COMMAND_KIND;
  toJSON(): any;
  execute(): Promise<void>;
}

export class CommitCommand implements GenericCommand {
  readonly kind = COMMAND_KIND.COMMIT;
  readonly event: ScrapingEvent;

  constructor(
    event: ScrapingEvent,
    private readonly organisationCreated: OrganisationCreatedEventDelta,
    private readonly appInstalled: AppInstalledEventDelta
  ) {
    this.event = event;
  }

  async execute(): Promise<void> {
    const event = this.event;
    console.log("Committing event", event);
    switch (event.kind) {
      case SCRAPING_EVENT_KIND.APP_INSTALLED:
        return this.appInstalled.commit(event);
      case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
        return this.organisationCreated.commit(event);
      default:
        throw new UnreachableCaseError(event);
    }
  }

  toJSON() {
    return {
      kind: this.kind,
      event: this.event
    };
  }
}

export class RevertCommand implements GenericCommand {
  readonly kind = COMMAND_KIND.REVERT;
  readonly eventId: string;

  constructor(
    eventId: string,
    private readonly eventRepository: EventRepository,
    private readonly organisationCreated: OrganisationCreatedEventDelta,
    private readonly appInstalled: AppInstalledEventDelta
  ) {
    this.eventId = eventId;
  }

  async execute(): Promise<void> {
    console.log("Trying to revert event", this);
    const eventId = this.eventId;
    const eventRow = await this.eventRepository.byId(eventId);
    if (eventRow) {
      const event = eventRow.payload;
      switch (event.kind) {
        case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
          return this.organisationCreated.revert(event);
        case SCRAPING_EVENT_KIND.APP_INSTALLED:
          return this.appInstalled.revert(event);
        default:
          throw new UnreachableCaseError(event);
      }
    } else {
      console.log(`No event found`, eventRow);
    }
  }

  toJSON() {
    return {
      kind: this.kind,
      eventId: this.eventId
    };
  }
}

export type Command = CommitCommand | RevertCommand;
