import { Inject, Service } from "typedi";
import { bind } from "decko";
import { BlockTickScenario } from "./block-tick.scenario";
import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { error, isHttp, ok } from "../shared/http-handler";
import { BlockAddEvent, BlockAddEventFactory } from "./block-add.event";
import { BlockAddScenario } from "./block-add.scenario";
import _ from "lodash";
import { BlockFactory } from "./block.factory";
import { BlocksQueue } from "./blocks.queue";
import { BadRequestError } from "../shared/errors";

@Service(BlockController.name)
export class BlockController {
  constructor(
    @Inject(BlockTickScenario.name) private readonly tickScenario: BlockTickScenario,
    @Inject(BlockAddScenario.name) private readonly addScenario: BlockAddScenario,
    @Inject(BlockAddEventFactory.name) private readonly eventFactory: BlockAddEventFactory,
    @Inject(BlockFactory.name) private readonly blockFactory: BlockFactory,
    @Inject(BlocksQueue.name) private readonly queue: BlocksQueue
  ) {}

  @bind()
  async add(event: APIGatewayEvent | SQSEvent) {
    try {
      if (isHttp(event)) {
        const blockAddEvent = this.eventFactory.fromString(event.body);

        const inplace = Boolean(event.queryStringParameters?.inplace);
        const commands = await this.addScenario.execute(blockAddEvent, false);
        if (inplace) {
          for (let command of commands) {
            await command.execute();
          }
        }
        return ok({ commands: commands });
      } else {
        await Promise.all(
          event.Records.map(async record => {
            const blockAddEvent = this.eventFactory.fromString(record.body);
            await this.addScenario.execute(blockAddEvent);
          })
        );
      }
    } catch (e) {
      console.error(e);
      return error(e);
    }
  }

  @bind()
  async massAdd(event: APIGatewayEvent) {
    const raw = event.body;
    if (raw) {
      const body = JSON.parse(raw);
      const start = Number(body.start);
      const finish = Number(body.finish) + 1;
      const naiveRange = _.range(start, finish);
      const range = naiveRange.map(n => BigInt(n));
      const blocks = await Promise.all(range.map(n => this.blockFactory.fromEthereum(n)));
      const events = blocks.map<BlockAddEvent>(block => this.eventFactory.fromBlock(block));
      await this.queue.sendBatch(events);
      return ok({ range: naiveRange });
    } else {
      error(new BadRequestError(`No payload specified`));
    }
  }

  @bind()
  async tick() {
    const worthAdding = await this.tickScenario.execute();
    console.debug("Worth adding: ", worthAdding);
  }
}
