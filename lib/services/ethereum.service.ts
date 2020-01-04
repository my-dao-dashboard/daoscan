import Web3 from "web3";
import { BlockTransactionString, Transaction, TransactionReceipt } from "web3-eth";
import { Log } from "web3-core/types";
import * as _ from "lodash";
import { Inject, Service } from "typedi";
import { ENV } from "../shared/env";
import { EnvService, IEnvService } from "./env.service";

export interface ExtendedTransactionReceipt extends TransactionReceipt {
  input: string;
}

export interface ExtendedBlock extends BlockTransactionString {
  receipts: ExtendedTransactionReceipt[];
  logs: Log[];
}

@Service(EthereumService.name)
export class EthereumService {
  readonly web3: Web3;

  constructor(@Inject(EnvService.name) env: IEnvService) {
    const endpoint = env.readString(ENV.ETHEREUM_RPC);
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

  async canonicalAddress(addressOrName: string): Promise<string> {
    if (this.web3.utils.isAddress(addressOrName)) {
      return addressOrName.toLowerCase();
    } else {
      const fromEns = await this.web3.eth.ens.getAddress(addressOrName);
      return fromEns.toLowerCase();
    }
  }
}
