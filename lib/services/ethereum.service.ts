import Web3 from "web3";
import { BlockTransactionString, Transaction, TransactionReceipt } from "web3-eth";
import { Log } from "web3-core/types";
import * as _ from "lodash";
import { Inject, Service } from "typedi";
import { AbiItem } from "web3-utils";
import { AbiCodec } from "./abi-codec";
import { Contract, ContractOptions } from "web3-eth-contract";
import { TransactionConfig } from "web3-core";
import { ENV, EnvService } from "./env.service";

export interface ExtendedTransactionReceipt extends TransactionReceipt {
  input: string;
}

export interface ExtendedBlock extends BlockTransactionString {
  receipts: ExtendedTransactionReceipt[];
  logs: Log[];
}

type BlockNumber = number | "latest" | bigint

@Service(EthereumService.name)
export class EthereumService {
  private readonly web3: Web3;
  readonly codec: AbiCodec;

  constructor(@Inject(EnvService.name) env: EnvService) {
    const endpoint = env.readString(ENV.ETHEREUM_RPC);
    const provider = new Web3.providers.HttpProvider(endpoint);
    this.web3 = new Web3(provider);
    this.codec = new AbiCodec(this.web3);
  }

  block(number: BlockNumber): Promise<BlockTransactionString> {
    return this.web3.eth.getBlock(number.toString());
  }

  async extendedBlock(number: BlockNumber): Promise<ExtendedBlock> {
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
      return addressOrName.toLowerCase();
    } else {
      const fromEns = await this.web3.eth.ens.getAddress(addressOrName);
      return fromEns.toLowerCase();
    }
  }
}
