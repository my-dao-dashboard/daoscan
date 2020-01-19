import { Inject, Service } from "typedi";
import { Scenario } from "../shared/scenario";
import { CommitCommand } from "./command";
import { SCRAPING_EVENT_KIND } from "./events/scraping-event.interface";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { OrganisationCreatedEventDelta } from "./events/organisation-created-event.delta";

@Service(CommandCommitScenario.name)
export class CommandCommitScenario implements Scenario<CommitCommand, void> {
  constructor(
    @Inject(OrganisationCreatedEventDelta.name) private readonly organisationCreated: OrganisationCreatedEventDelta
  ) {}

  async execute(command: CommitCommand): Promise<void> {
    const event = command.event;
    console.log("Committing event", event);
    switch (event.kind) {
      case SCRAPING_EVENT_KIND.APP_INSTALLED:
        console.log("TODO CommandCommitScenario.execute for app installed");
        return;
      case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
        return this.organisationCreated.commit(event);
      default:
        throw new UnreachableCaseError(event);
    }
  }
}
