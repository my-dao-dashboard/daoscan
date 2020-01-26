import { Inject, Service } from "typedi";
import { bind } from "decko";
import { SQSEvent } from "aws-lambda";
import { CommandFactory } from "./command.factory";

@Service(CommandController.name)
export class CommandController {
  constructor(@Inject(CommandFactory.name) private readonly commandFactory: CommandFactory) {}

  @bind()
  async handle(event: SQSEvent): Promise<void> {
    await Promise.all(
      event.Records.map(async record => {
        const command = this.commandFactory.fromString(record.body);
        await command.execute();
      })
    );
  }
}
