import { Scenario } from "../shared/scenario.interface";
import { Inject, Service } from "typedi";
import _ from "lodash";
import { EthereumBlockRowRepository } from "../rel-storage/ethereum-block-row.repository";
import { BlocksQueue } from "../queues/blocks.queue";
import { EthereumService } from "../services/ethereum.service";

export const DEPTH = 20;

@Service(TickBlockScenario.name)
export class TickBlockScenario implements Scenario<{}, void> {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(EthereumBlockRowRepository.name) private readonly ethereumBlockRowRepository: EthereumBlockRowRepository,
    @Inject(BlocksQueue.name) private readonly blocksQueue: BlocksQueue
  ) {}

  async recentBlockNumbers(): Promise<number[]> {
    const latest = await this.ethereum.latestBlockNumber();
    return _.times(DEPTH).reduce<number[]>((acc, number) => acc.concat([latest - number]), []);
  }

  isBlockParsed(id: number): Promise<boolean> {
    return this.ethereumBlockRowRepository.isPresent(id);
  }

  async queueBlock(id: number) {
    await this.blocksQueue.send(id);
  }

  async execute(): Promise<void> {
    const blockNumbers = await this.recentBlockNumbers();
    await Promise.all(
      blockNumbers.map(async id => {
        const isPresent = await this.isBlockParsed(id);
        if (!isPresent) {
          await this.queueBlock(id);
        }
      })
    );
  }
}
