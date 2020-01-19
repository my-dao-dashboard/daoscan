import { Scenario } from "../shared/scenario";
import { CommitCommand } from "./command";
import { Service } from "typedi";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { SCRAPING_EVENT_KIND } from "./events/scraping-event.interface";

@Service(CommandCommitScenario.name)
export class CommandCommitScenario implements Scenario<CommitCommand, void> {
  constructor() {}

  async execute(command: CommitCommand): Promise<void> {
    const event = command.event;
    switch (event.kind) {
      case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
        console.log("CommandCommitScenario.execute", event);
        return;
      // return this.organisationCreated.commit(event);
      default:
        throw new UnreachableCaseError(event.kind);
    }
  }
}
