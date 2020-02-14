import { AbiInput } from "web3-utils";

export interface BlockchainEvent<A> {
  sources?: string[];
  signature: string;
  abi: AbiInput[];
}
