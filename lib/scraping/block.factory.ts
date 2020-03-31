import { Inject, Service } from "typedi";
import { EthereumService } from "../services/ethereum.service";
import { Block } from "./block";
import { BlockRepository } from "../storage/block.repository";
import { BlockRecord as Row } from "../storage/block.record";
import { CommandFactory } from "./command.factory";

@Service(BlockFactory.name)
export class BlockFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(BlockRepository.name) private readonly repository: BlockRepository,
    @Inject(CommandFactory.name) private readonly commandFactory: CommandFactory
  ) {}

  fromRow(row: Row): Block {
    const props = {
      id: BigInt(row.id),
      hash: row.hash.toLowerCase()
    };
    return new Block(props, this.repository, this.ethereum, this.commandFactory);
  }

  async allFromStorage(ids: bigint[]): Promise<Block[]> {
    const rows = await this.repository.allByIds(ids);
    return rows.map(row => {
      return this.fromRow(row);
    });
  }

  async fromEthereum(id: number | "latest" | bigint): Promise<Block> {
    const ethereumBlock = await this.ethereum.block(id);
    const props = {
      id: BigInt(ethereumBlock.number),
      hash: ethereumBlock.hash.toLowerCase()
    };
    return new Block(props, this.repository, this.ethereum, this.commandFactory);
  }
}
