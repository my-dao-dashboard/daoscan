import { AbiInput } from "web3-utils";
import { Log } from "web3-core/types";
import Web3 from "web3";
import { ExtendedBlock } from "../ethereum.service";

export interface BlockchainEvent<A> {
  signature: string;
  abi: AbiInput[];
}

export interface DecodedLog<A extends { [key: string]: string }> extends Log {
  parameters: A;
}

export class BlockParsing {
  constructor(private readonly web3: Web3) {}

  transactions(
    block: ExtendedBlock,
    whitelist: Set<string>,
    abiMap: Map<string, AbiInput[]>
  ): any {
    return block.receipts
      .filter(t => whitelist.has(t.to.toLowerCase()) || whitelist.size === 0)
      .filter(t => abiMap.has(t.input.slice(0, 10)))
      .map(t => {
        const signature = t.input.slice(0, 10);
        const abi = abiMap.get(signature)!;
        const parameters = this.web3.eth.abi.decodeParameters(abi, "0x" + t.input.slice(10));
        return {
          ...t,
          parameters
        };
      });
  }

  async events<A extends { [key: string]: string }>(
    block: ExtendedBlock,
    event: BlockchainEvent<A>
  ): Promise<DecodedLog<A>[]> {
    const promised = block.logs
      .filter(log => log.topics[0] === event.signature)
      .map(log => {
        const parameters = this.web3.eth.abi.decodeLog(event.abi, log.data, log.topics) as A;
        return {
          ...log,
          parameters
        };
      });
    return Promise.all(promised);
  }
}
