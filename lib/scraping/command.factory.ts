import { Inject, Service } from "typedi";
import { Block } from "./block";
import { Command, CommitCommand, KIND, RevertCommand } from "./command";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { EventFactory } from "./events/event.factory";

@Service(CommandFactory.name)
export class CommandFactory {
  constructor(@Inject(EventFactory.name) private readonly eventFactory: EventFactory) {}

  fromString(payload: string): Command {
    const parsed = JSON.parse(payload);
    const kind = KIND.fromString(parsed.kind);
    switch (kind) {
      case KIND.COMMIT:
        return parsed as CommitCommand;
      case KIND.REVERT:
        return parsed as RevertCommand;
      default:
        throw new UnreachableCaseError(kind);
    }
  }

  async commitBlock(block: Block): Promise<Command[]> {
    const events = await this.eventFactory.fromBlock(block);
    return events.map<CommitCommand>(event => {
      return {
        kind: KIND.COMMIT,
        event
      };
    });
  }

  async revertBlock(block: Block): Promise<Command[]> {
    return [];
  }
}
