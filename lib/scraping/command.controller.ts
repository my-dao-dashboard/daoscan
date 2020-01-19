import { Inject, Service } from "typedi";
import { bind } from "decko";
import { SQSEvent } from "aws-lambda";
import { CommandFactory } from "./command.factory";
import { COMMAND_KIND } from "./command.kind";
import { CommandCommitScenario } from "./command-commit.scenario";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { CommandRevertScenario } from "./command-revert.scenario";

@Service(CommandController.name)
export class CommandController {
  constructor(
    @Inject(CommandFactory.name) private readonly commandFactory: CommandFactory,
    @Inject(CommandCommitScenario.name) private readonly commitScenario: CommandCommitScenario,
    @Inject(CommandRevertScenario.name) private readonly revertScenario: CommandRevertScenario
  ) {}

  @bind()
  async handle(event: SQSEvent): Promise<void> {
    await Promise.all(
      event.Records.map(async record => {
        const command = this.commandFactory.fromString(record.body);
        switch (command.kind) {
          case COMMAND_KIND.REVERT:
            return this.revertScenario.execute(command);
          case COMMAND_KIND.COMMIT:
            return this.commitScenario.execute(command);
          default:
            throw new UnreachableCaseError(command);
        }
      })
    );
  }
}
