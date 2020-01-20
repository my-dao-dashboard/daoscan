import { Scenario } from "../shared/scenario";
import { RevertCommand } from "./command";
import { Inject, Service } from "typedi";
import { EventFactory } from "./events/event.factory";
import { EventRepository } from "../storage/event.repository";
import { SCRAPING_EVENT_KIND } from "./events/scraping-event.interface";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import {OrganisationCreatedEventDelta} from "./events/organisation-created-event.delta";

@Service(CommandRevertScenario.name)
export class CommandRevertScenario implements Scenario<RevertCommand, void> {
  constructor(
    @Inject(EventFactory.name) private readonly eventFactory: EventFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationCreatedEventDelta.name) private readonly organisationCreated: OrganisationCreatedEventDelta
  ) {}

  async execute(command: RevertCommand): Promise<void> {
    console.log("Trying to revert event", command);
    const eventId = command.eventId;
    const eventRow = await this.eventRepository.byId(eventId);
    if (eventRow) {
      const event = eventRow.payload;
      switch (event.kind) {
        case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
          return this.organisationCreated.revert(event)
        case SCRAPING_EVENT_KIND.APP_INSTALLED:
          console.log("TODO CommandRevertScenario.execute for APP_INSTALLED");
          return;
        default:
          throw new UnreachableCaseError(event);
      }
    } else {
      console.log(`No event found`, eventRow);
    }
  }
}
