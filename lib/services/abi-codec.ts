import Web3 from "web3";
import { AbiInput } from "web3-utils";

export class AbiCodec {
  constructor(private readonly web3: Web3) {}

  decodeParameters(types: any[], hex: string): { [key: string]: any } {
    return this.web3.eth.abi.decodeParameters(types, hex);
  }

  decodeLog(inputs: AbiInput[], hex: string, topics: string[]): { [key: string]: string } {
    return this.web3.eth.abi.decodeLog(inputs, hex, topics);
  }
}
