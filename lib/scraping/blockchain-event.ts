import { AbiInput } from "web3-utils";

export interface BlockchainEvent<A> {
  signature: string;
  abi: AbiInput[];
}
