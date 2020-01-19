import { Scenario } from "../shared/scenario";
import { CommitCommand } from "./command";
import { Inject, Service } from "typedi";
import { OrganisationCreatedEventDelta } from "./events/organisation-created-event.delta";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import {SCRAPING_EVENT_KIND} from "./events/event";

@Service(CommandCommitScenario.name)
export class CommandCommitScenario implements Scenario<CommitCommand, void> {
  constructor(
    @Inject(OrganisationCreatedEventDelta.name) private readonly organisationCreated: OrganisationCreatedEventDelta
  ) {}

  async execute(command: CommitCommand): Promise<void> {
    const event = command.event;
    switch (event.kind) {
      case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
        return this.organisationCreated.commit(event);
      default:
        throw new UnreachableCaseError(event.kind);
    }
  }
}
