import { Inject, Service } from "typedi";
import { EthereumService } from "../services/ethereum.service";
import { Block } from "./block";
import { BlockRepository } from "../storage/block.repository";

@Service(BlockFactory.name)
export class BlockFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(BlockRepository.name) private readonly repository: BlockRepository
  ) {}

  async allFromStorage(ids: number[]): Promise<Block[]> {
    const rows = await this.repository.allByIds(ids);
    return rows.map(row => {
      return new Block({ id: row.id, hash: row.hash.toLowerCase() });
    });
  }

  async fromEthereum(id: number | "latest"): Promise<Block> {
    const ethereumBlock = await this.ethereum.block(id);
    const props = {
      id: ethereumBlock.number,
      hash: ethereumBlock.hash.toLowerCase()
    };
    return new Block(props);
  }
}
