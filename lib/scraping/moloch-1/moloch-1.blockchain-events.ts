import { BlockchainEvent } from "../blockchain-event";
import { Indexed } from "../../shared/indexed";

export interface SummonCompleteParams extends Indexed<string> {
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

export interface SubmitProposalParams extends Indexed<string> {
  applicant: string;
  tokenTribute: string;
  sharesRequested: string;
  details: string;
}

export const SUBMIT_PROPOSAL_BLOCKCHAIN_EVENT: BlockchainEvent<SubmitProposalParams> = {
  signature: "0x2d105ebbc222c190059b3979356e13469f6a29a350add74ac3bf4f22f16301d6",
  abi: [
    { indexed: false, name: "proposalIndex", type: "uint256" },
    { indexed: true, name: "delegateKey", type: "address" },
    { indexed: true, name: "memberAddress", type: "address" },
    { indexed: true, name: "applicant", type: "address" },
    { indexed: false, name: "tokenTribute", type: "uint256" },
    { indexed: false, name: "sharesRequested", type: "uint256" }
  ]
};
