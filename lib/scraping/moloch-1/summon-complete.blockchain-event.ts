import { BlockchainEvent } from "../blockchain-event";

export interface SummonCompleteParams {
  summoner: string;
  shares: string;
}

export const SUMMON_COMPLETE_BLOCKCHAIN_EVENT: BlockchainEvent<SummonCompleteParams> = {
  signature: "0x03995a801b13c36325306deef859ef977ce61c6e15a794281bf969d204825227",
  abi: [
    { indexed: true, name: "summoner", type: "address" },
    { indexed: false, name: "shares", type: "uint256" }
  ]
};
