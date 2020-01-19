import { Inject, Service } from "typedi";
import { Scenario } from "../shared/scenario";
import { BlockAddEvent } from "./block-add.event";
import { BlockFactory } from "./block.factory";
import { ScrapingQueue } from "./scraping.queue";
import { Command } from "./command";

@Service(BlockAddScenario.name)
export class BlockAddScenario implements Scenario<BlockAddEvent, void> {
  constructor(
    @Inject(BlockFactory.name) private readonly blockFactory: BlockFactory,
    @Inject(ScrapingQueue.name) private readonly queue: ScrapingQueue
  ) {}

  async fanout(commands: Command[]): Promise<void> {
    await this.queue.sendBatch(commands);
  }

  async execute(blockAddEvent: BlockAddEvent): Promise<void> {
    const id = blockAddEvent.id;
    const block = await this.blockFactory.fromEthereum(id);
    // determine if reorg
    // if reorg => block revert scenario
    // block save scenario
    console.log("isOverwrite", await block.isOverwrite());
    const commands = await block.commands();
    await this.fanout(commands);
    await block.save();
  }
}
