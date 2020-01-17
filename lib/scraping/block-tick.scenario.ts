import { Scenario } from "../shared/scenario";
import { Inject, Service } from "typedi";
import { BlocksQueue } from "../queues/blocks.queue";
import { EthereumService } from "../services/ethereum.service";
import { BlockRepository } from "../storage/block.repository";
import _ from "lodash";
import { BlockTransactionString } from "web3-eth";
import { BlockAddEvent } from "./block-add.event";

const DEPTH = 20;

interface Block {
  id: number;
  hash: string;
}

function fromEthereumBlock(ethereumBlock: BlockTransactionString): Block {
  return {
    id: ethereumBlock.number,
    hash: ethereumBlock.hash.toLowerCase()
  };
}

@Service(BlockTickScenario.name)
export class BlockTickScenario implements Scenario<void, Block[]> {
  constructor(
    @Inject(BlocksQueue.name) private readonly queue: BlocksQueue,
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(BlockRepository.name) private readonly blockRepository: BlockRepository
  ) {}

  async storedBlocks(ids: number[]): Promise<Block[]> {
    return this.blockRepository.allByIds(ids);
  }

  async recentBlockNumbers() {
    const latestBlock = await this.ethereum.block("latest");
    const latestBlockNumber = latestBlock.number;
    return _.times(DEPTH).map(i => latestBlockNumber - i);
  }

  async recentBlocks(ids: number[]): Promise<Block[]> {
    const ethereumBlocks = await Promise.all(ids.map(async id => this.ethereum.block(id)));
    return ethereumBlocks.map(fromEthereumBlock);
  }

  blocksWorthAdding(recent: Block[], stored: Block[]) {
    return _.differenceWith(recent, stored, (a, b) => a.id == b.id && a.hash == b.hash);
  }

  async execute() {
    const recentBlockNumbers = await this.recentBlockNumbers();
    const recentBlocks = await this.recentBlocks(recentBlockNumbers);
    const storedBlocks = await this.storedBlocks(recentBlockNumbers);
    const worthAdding = this.blocksWorthAdding(recentBlocks, storedBlocks);
    const events = worthAdding.map<BlockAddEvent>(b => {
      return { id: b.id };
    });
    await this.queue.sendBatch(events);
    return worthAdding;
  }
}
