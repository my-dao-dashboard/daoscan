import { Inject, Service } from "typedi";
import { Scenario } from "../shared/scenario";
import { BlockAddEvent } from "./block-add.event";
import { BlockFactory } from "./block.factory";
import { ScrapingQueue } from "./scraping.queue";
import { Command } from "./command";

@Service(BlockAddScenario.name)
export class BlockAddScenario implements Scenario<BlockAddEvent, Command[]> {
  constructor(
    @Inject(BlockFactory.name) private readonly blockFactory: BlockFactory,
    @Inject(ScrapingQueue.name) private readonly queue: ScrapingQueue
  ) {}

  async fanout(commands: Command[]): Promise<void> {
    await this.queue.sendBatch(commands);
  }

  async execute(blockAddEvent: BlockAddEvent): Promise<Command[]> {
    const block = await this.blockFactory.fromEthereum(blockAddEvent.id);
    const commands = await block.commands();
    await this.fanout(commands);
    await block.save();
    return commands;
  }
}
