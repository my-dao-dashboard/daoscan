import Web3 from "web3";
import { BlockTransactionString, Transaction, TransactionReceipt } from "web3-eth";
import { Log } from "web3-core/types";
import * as _ from "lodash";
import { ENV, FromEnv } from "./shared/from-env";
import { Service } from "typedi";

const BASE = "https://mainnet.infura.io/v3";

export interface ExtendedTransactionReceipt extends TransactionReceipt {
  input: string;
}

export interface ExtendedBlock extends BlockTransactionString {
  receipts: ExtendedTransactionReceipt[];
  logs: Log[];
}

@Service()
export class EthereumService {
  readonly web3: Web3;

  constructor() {
    const projectId = FromEnv.readString(ENV.INFURA_PROJECT_ID);
    const endpoint = `${BASE}/${projectId}`;
    const provider = new Web3.providers.HttpProvider(endpoint);
    this.web3 = new Web3(provider);
  }

  block(number: string | number): Promise<BlockTransactionString> {
    return this.web3.eth.getBlock(number);
  }

  async extendedBlock(number: string | number): Promise<ExtendedBlock> {
    const block = await this.block(number);
    const receipts = await Promise.all(
      block.transactions.map(async txid => {
        const receipt = await this.transactionReceipt(txid);
        const tx = await this.transaction(txid);
        return {
          ...receipt,
          input: tx.input
        };
      })
    );
    const logs = _.flatten(receipts.map(r => r.logs));
    return {
      ...block,
      receipts,
      logs
    };
  }

  transaction(txid: string): Promise<Transaction> {
    return this.web3.eth.getTransaction(txid);
  }

  transactionReceipt(txid: string): Promise<TransactionReceipt> {
    return this.web3.eth.getTransactionReceipt(txid);
  }
}
