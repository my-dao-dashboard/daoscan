import { Scenario } from "../shared/scenario";
import { Inject, Service } from "typedi";
import { BlocksQueue } from "./blocks.queue";
import _ from "lodash";
import { BlockAddEvent, BlockAddEventFactory } from "./block-add.event";
import { Block } from "./block";
import { BlockFactory } from "./block.factory";

const DEPTH = 20;

@Service(BlockTickScenario.name)
export class BlockTickScenario implements Scenario<void, Block[]> {
  constructor(
    @Inject(BlocksQueue.name) private readonly queue: BlocksQueue,
    @Inject(BlockFactory.name) private readonly blockFactory: BlockFactory,
    @Inject(BlockAddEventFactory.name) private readonly eventFactory: BlockAddEventFactory
  ) {}

  async storedBlocks(ids: bigint[]): Promise<Block[]> {
    return this.blockFactory.allFromStorage(ids);
  }

  async recentBlockNumbers() {
    const latestBlock = await this.blockFactory.fromEthereum("latest");
    const latestBlockNumber = latestBlock.id;
    return _.times(DEPTH).map(i => latestBlockNumber - BigInt(i));
  }

  async recentBlocks(ids: bigint[]): Promise<Block[]> {
    return Promise.all(ids.map(async id => this.blockFactory.fromEthereum(id)));
  }

  blocksWorthAdding(recent: Block[], stored: Block[]) {
    return _.differenceWith(recent, stored, (a, b) => a.equals(b));
  }

  async execute() {
    const recentBlockNumbers = await this.recentBlockNumbers();
    const recentBlocks = await this.recentBlocks(recentBlockNumbers);
    const storedBlocks = await this.storedBlocks(recentBlockNumbers);
    const worthAdding = this.blocksWorthAdding(recentBlocks, storedBlocks);
    const events = worthAdding.map<BlockAddEvent>(block => this.eventFactory.fromBlock(block));
    await this.queue.sendBatch(events);
    return worthAdding;
  }
}
