import _ from "lodash";
import { BlockRepository } from "../storage/block.repository";
import { Block as Row } from "../storage/block.row";
import { Command } from "./command";
import { EthereumService, ExtendedBlock, ExtendedTransactionReceipt } from "../services/ethereum.service";
import { CommandFactory } from "./command.factory";
import { Memoize } from "typescript-memoize";

export interface BlockProps {
  id: bigint;
  hash: string;
}

export class Block {
  constructor(
    protected readonly props: BlockProps,
    private readonly repository: BlockRepository,
    private readonly ethereum: EthereumService,
    private readonly commandFactory: CommandFactory
  ) {}

  get id(): bigint {
    return this.props.id;
  }

  get hash(): string {
    return this.props.hash.toLowerCase();
  }

  async isOverwrite() {
    return this.repository.isPresent(this.id);
  }

  async commands(): Promise<Command[]> {
    // TODO Put revert command
    const commitCommands = await this.commandFactory.commitBlock(this);
    return commitCommands;
  }

  @Memoize()
  async extendedBlock(): Promise<ExtendedBlock> {
    return this.ethereum.extendedBlock(this.id);
  }

  async receipts(): Promise<ExtendedTransactionReceipt[]> {
    const extendedBlock = await this.extendedBlock();
    return extendedBlock.receipts;
  }

  async timestamp(): Promise<number> {
    const extendedBlock = await this.extendedBlock();
    return Number(extendedBlock.timestamp);
  }

  equals(other: Block): boolean {
    return _.isEqual(this.props, other.props);
  }

  toJSON() {
    return this.props;
  }

  async save(): Promise<void> {
    const row = new Row();
    row.id = this.id;
    row.hash = this.hash;
    await this.repository.save(row);
  }
}
