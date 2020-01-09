import Web3 from "web3";
import { AbiInput, AbiItem } from "web3-utils";

export class AbiCodec {
  constructor(private readonly web3: Web3) {}

  decodeParameters(types: any[], hex: string): { [key: string]: any } {
    return this.web3.eth.abi.decodeParameters(types, hex);
  }

  encodeFunctionCall(abiItem: AbiItem, params: string[]): string {
    return this.web3.eth.abi.encodeFunctionCall(abiItem, params);
  }

  decodeLog(inputs: AbiInput[], hex: string, topics: string[]): { [key: string]: string } {
    return this.web3.eth.abi.decodeLog(inputs, hex, topics);
  }

  decodeParameter(type: any, hex: string): string {
    // Invalid typing in web3
    return (this.web3.eth.abi.decodeParameter(type, hex) as unknown) as string;
  }
}
