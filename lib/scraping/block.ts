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
    let commands: Command[] = [];
    if (this.isOverwrite()) {
      const revertCommands = await this.commandFactory.revertBlock(this);
      commands = commands.concat(revertCommands);
    }
    const commitCommands = await this.commandFactory.commitBlock(this);
    console.log("commitCommands", commitCommands);
    return commands.concat(commitCommands);
  }

  @Memoize()
  async extendedBlock(): Promise<ExtendedBlock> {
    const fromStorage = await this.repository.byId(this.id);
    if (fromStorage && fromStorage.body) {
      return fromStorage.body;
    } else {
      return this.ethereum.extendedBlock(this.id);
    }
  }

  async receipts(): Promise<ExtendedTransactionReceipt[]> {
    const extendedBlock = await this.extendedBlock();
    return extendedBlock.receipts;
  }

  async timestamp(): Promise<number> {
    const extendedBlock = await this.extendedBlock();
    return Number(extendedBlock.timestamp);
  }

  async timestampDate(): Promise<Date> {
    const timestamp = await this.timestamp();
    return new Date(timestamp * 1000);
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
    row.body = await this.extendedBlock();
    await this.repository.save(row);
  }
}
