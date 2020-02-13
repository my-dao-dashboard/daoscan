import { Inject, Service } from "typedi";
import { Block } from "./block";
import { Command, CommitCommand, RevertCommand } from "./command";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { ScrapingEventFactory } from "./events/scraping-event.factory";
import { COMMAND_KIND } from "./command.kind";
import { EventRepository } from "../storage/event.repository";

@Service(CommandFactory.name)
export class CommandFactory {
  constructor(
    @Inject(ScrapingEventFactory.name) private readonly eventFactory: ScrapingEventFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository
  ) {}

  fromString(payload: string): Command {
    console.log("trying to parse", payload);
    const parsed = JSON.parse(payload);
    console.log("parsed", parsed);
    return this.fromJSON(parsed);
  }

  fromJSON(payload: any): Command {
    const kind = COMMAND_KIND.fromString(payload.kind);
    switch (kind) {
      case COMMAND_KIND.COMMIT:
        const commitEvent = this.eventFactory.fromJSON(payload.event);
        return new CommitCommand(commitEvent);
      case COMMAND_KIND.REVERT:
        return new RevertCommand(payload.eventId, this.eventFactory);
      default:
        throw new UnreachableCaseError(kind);
    }
  }

  async commitBlock(block: Block): Promise<CommitCommand[]> {
    const events = await this.eventFactory.fromBlock(block);
    return events.map<CommitCommand>(event => {
      return new CommitCommand(event);
    });
  }

  async revertBlock(block: Block): Promise<RevertCommand[]> {
    const rows = await this.eventRepository.allForBlock(block.id, block.hash);
    return rows.map<RevertCommand>(row => {
      const eventId = row.serialId.toString();
      return new RevertCommand(eventId, this.eventFactory);
    });
  }
}
