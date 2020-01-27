import { Inject, Service } from "typedi";
import { Block } from "./block";
import { Command, CommitCommand, RevertCommand } from "./command";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { ScrapingEventFactory } from "./events/scraping-event.factory";
import { COMMAND_KIND } from "./command.kind";
import { EventRepository } from "../storage/event.repository";
import { OrganisationCreatedEventDelta } from "./events/organisation-created-event.delta";
import { AppInstalledEventDelta } from "./events/app-installed-event.delta";

@Service(CommandFactory.name)
export class CommandFactory {
  constructor(
    @Inject(ScrapingEventFactory.name) private readonly eventFactory: ScrapingEventFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationCreatedEventDelta.name) private readonly organisationCreated: OrganisationCreatedEventDelta,
    @Inject(AppInstalledEventDelta.name) private readonly appInstalled: AppInstalledEventDelta
  ) {}

  fromString(payload: string): Command {
    console.log("trying to parse", payload);
    const parsed = JSON.parse(payload);
    console.log("parsed", parsed);
    const kind = COMMAND_KIND.fromString(parsed.kind);
    switch (kind) {
      case COMMAND_KIND.COMMIT:
        const commitEvent = this.eventFactory.fromJSON(parsed.event);
        return new CommitCommand(commitEvent, this.organisationCreated, this.appInstalled);
      case COMMAND_KIND.REVERT:
        return new RevertCommand(parsed.eventId, this.eventFactory, this.organisationCreated, this.appInstalled);
      default:
        throw new UnreachableCaseError(kind);
    }
  }

  async commitBlock(block: Block): Promise<CommitCommand[]> {
    const events = await this.eventFactory.fromBlock(block);
    return events.map<CommitCommand>(event => {
      return new CommitCommand(event, this.organisationCreated, this.appInstalled);
    });
  }

  async revertBlock(block: Block): Promise<RevertCommand[]> {
    const rows = await this.eventRepository.allForBlock(block.id, block.hash);
    return rows.map<RevertCommand>(row => {
      const eventId = row.id.toString();
      return new RevertCommand(eventId, this.eventFactory, this.organisationCreated, this.appInstalled);
    });
  }
}
