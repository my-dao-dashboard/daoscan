import { Inject, Service } from "typedi";
import { bind } from "decko";
import { BlockTickScenario } from "./block-tick.scenario";
import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { isHttp, ok } from "../shared/http-handler";
import { BlockAddEvent } from "./block-add.event";
import { BlockAddScenario } from "./block-add.scenario";

@Service(BlockController.name)
export class BlockController {
  constructor(
    @Inject(BlockTickScenario.name) private readonly tickScenario: BlockTickScenario,
    @Inject(BlockAddScenario.name) private readonly addScenario: BlockAddScenario
  ) {}

  @bind()
  async add(event: APIGatewayEvent | SQSEvent) {
    if (isHttp(event)) {
      const blockAddEvent = BlockAddEvent.fromString(event.body);
      await this.addScenario.execute(blockAddEvent);
      return ok();
    } else {
      await Promise.all(
        event.Records.map(async record => {
          const blockAddEvent = BlockAddEvent.fromString(record.body);
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
