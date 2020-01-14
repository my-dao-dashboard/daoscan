import { BlockTransactionString } from "web3-eth";
import { Log } from "web3-core";
import { ExtendedTransactionReceipt } from "../services/ethereum.service";

export interface EthereumBlockProps extends BlockTransactionString {
  receipts: ExtendedTransactionReceipt[];
  logs: Log[];
}

export class EthereumBlock {
  constructor(private readonly props: EthereumBlockProps) {}

  get number (): number {
    return this.props.number
  }
}
