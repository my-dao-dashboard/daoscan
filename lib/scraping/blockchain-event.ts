import { AbiInput } from "web3-utils";

export interface BlockchainEvent<A> {
  contracts?: string[];
  signature: string;
  abi: AbiInput[];
}
