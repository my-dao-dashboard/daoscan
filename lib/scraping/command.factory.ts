import { Inject, Service } from "typedi";
import { Block } from "./block";
import { Command, CommitCommand, KIND } from "./command";
import { AragonEventFactory } from "./aragon/aragon-event.factory";

@Service(CommandFactory.name)
export class CommandFactory {
  constructor(@Inject(AragonEventFactory.name) private readonly aragon: AragonEventFactory) {}

  async commitBlock(block: Block): Promise<Command[]> {
    const aragonEvents = await this.aragon.fromBlock(block);
    return aragonEvents.map<CommitCommand>(event => {
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
