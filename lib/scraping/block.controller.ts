import { Inject, Service } from "typedi";
import { bind } from "decko";
import { BlockTickScenario } from "./block-tick.scenario";
import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { isHttp, ok } from "../shared/http-handler";
import { BlockAddEventFactory } from "./block-add.event";
import { BlockAddScenario } from "./block-add.scenario";
import { CommandFactory } from "./command.factory";

@Service(BlockController.name)
export class BlockController {
  constructor(
    @Inject(BlockTickScenario.name) private readonly tickScenario: BlockTickScenario,
    @Inject(BlockAddScenario.name) private readonly addScenario: BlockAddScenario,
    @Inject(BlockAddEventFactory.name) private readonly eventFactory: BlockAddEventFactory
  ) {}

  @bind()
  async add(event: APIGatewayEvent | SQSEvent) {
    if (isHttp(event)) {
      const blockAddEvent = this.eventFactory.fromString(event.body);
      const commands = await this.addScenario.execute(blockAddEvent);
      const inplace = event.queryStringParameters?.inplace;
      if (inplace) {
        await Promise.all(
          commands.map(async command => {
            await command.execute();
          })
        );
      }
      return ok({ commands });
    } else {
      await Promise.all(
        event.Records.map(async record => {
          const blockAddEvent = this.eventFactory.fromString(record.body);
          await this.addScenario.execute(blockAddEvent);
        })
      );
    }
  }

  @bind()
  async tick() {
    const worthAdding = await this.tickScenario.execute();
    console.debug("Worth adding: ", worthAdding);
  }
}
