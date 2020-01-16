import Web3 from "web3";
import { BlockTransactionString, Transaction, TransactionReceipt } from "web3-eth";
import { Log } from "web3-core/types";
import * as _ from "lodash";
import { Inject, Service } from "typedi";
import { ENV } from "../shared/env";
import { EnvService, IEnvService } from "./env.service";
import { AbiItem } from "web3-utils";
import { AbiCodec } from "./abi-codec";
import { Contract, ContractOptions } from "web3-eth-contract";
import { TransactionConfig } from "web3-core";

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
  readonly codec: AbiCodec;

  constructor(@Inject(EnvService.name) env: IEnvService) {
    const endpoint = env.readString(ENV.ETHEREUM_RPC);
    const provider = new Web3.providers.HttpProvider(endpoint);
    this.web3 = new Web3(provider);
    this.codec = new AbiCodec(this.web3);
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

  contract(jsonInterface: AbiItem[] | AbiItem, address?: string, options?: ContractOptions): Contract {
    return new this.web3.eth.Contract(jsonInterface, address, options);
  }

  call(transactionConfig: TransactionConfig): Promise<string> {
    return this.web3.eth.call(transactionConfig);
  }

  async canonicalAddress(addressOrName: string): Promise<string> {
    if (this.web3.utils.isAddress(addressOrName)) {
      console.log('isAddress', addressOrName)
      return addressOrName.toLowerCase();
    } else {
      console.log('ens', addressOrName)
      try {
        const fromEnsA = await this.web3.eth.ens.getAddress(addressOrName);
      } catch (e) {
        console.error(e)
      }
      const fromEns = await this.web3.eth.ens.getAddress(addressOrName);
      return fromEns.toLowerCase();
    }
  }

  async latestBlockNumber(): Promise<number> {
    const block = await this.web3.eth.getBlock("latest");
    return block.number;
  }
}
