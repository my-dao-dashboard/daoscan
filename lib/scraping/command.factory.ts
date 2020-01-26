import { Inject, Service } from "typedi";
import { Block } from "./block";
import { Command, CommitCommand, RevertCommand } from "./command";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { EventFactory } from "./events/event.factory";
import { COMMAND_KIND } from "./command.kind";
import { EventRepository } from "../storage/event.repository";

@Service(CommandFactory.name)
export class CommandFactory {
  constructor(
    @Inject(EventFactory.name) private readonly eventFactory: EventFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository
  ) {}

  fromString(payload: string): Command {
    console.log("trying to parse", payload);
    const parsed = JSON.parse(payload);
    console.log("parsed", parsed);
    const kind = COMMAND_KIND.fromString(parsed.kind);
    switch (kind) {
      case COMMAND_KIND.COMMIT:
        return new CommitCommand(parsed.event);
      case COMMAND_KIND.REVERT:
        return new RevertCommand(parsed.eventId);
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
      return new RevertCommand(row.id.toString());
    });
  }
}
