import { Inject, Service } from "typedi";
import { bind } from "decko";
import { SQSEvent } from "aws-lambda";
import { CommandFactory } from "./command.factory";
import { CommandCommitScenario } from "./command-commit.scenario";
import { KIND } from "./command";
import { UnreachableCaseError } from "../shared/unreachable-case-error";

@Service(CommandController.name)
export class CommandController {
  constructor(
    @Inject(CommandFactory.name) private readonly commandFactory: CommandFactory,
    @Inject(CommandCommitScenario.name) private readonly commitScenario: CommandCommitScenario
  ) {}

  @bind()
  async handle(event: SQSEvent): Promise<void> {
    await Promise.all(
      event.Records.map(async record => {
        const command = this.commandFactory.fromString(record.body);
        switch (command.kind) {
          case KIND.REVERT:
            console.log("got revert command", command);
            return;
          case KIND.COMMIT:
            return this.commitScenario.execute(command);
          default:
            throw new UnreachableCaseError(command);
        }
      })
    );
  }
}
