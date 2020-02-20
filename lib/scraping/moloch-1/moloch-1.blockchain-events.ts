import { BlockchainEvent } from "../blockchain-event";
import { Indexed } from "../../shared/indexed";
import { stringify } from "querystring";

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

export interface SubmitProposalParams {
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

export interface SubmitVoteParams {
  proposalIndex: string;
  delegateKey: string;
  memberAddress: string;
  uintVote: number;
}

export const SUBMIT_VOTE_BLOCKCHAIN_EVENT: BlockchainEvent<SubmitVoteParams> = {
  signature: "0x29bf0061f2faa9daa482f061b116195432d435536d8af4ae6b3c5dd78223679b",
  abi: [
    { indexed: true, name: "proposalIndex", type: "uint256" },
    { indexed: true, name: "delegateKey", type: "address" },
    { indexed: true, name: "memberAddress", type: "address" },
    { indexed: false, name: "uintVote", type: "uint8" }
  ]
};

export interface ProcessProposalParams {
  proposalIndex: string;
  applicant: string;
  memberAddress: string;
  tokenTribute: string;
  sharesRequested: string;
  didPass: boolean;
}

export const PROCESS_PROPOSAL_BLOCKCHAIN_EVENT: BlockchainEvent<ProcessProposalParams> = {
  signature: "0x3f6fc303a82367bb4947244ba21c569a5ed2e870610f1a693366142309d7cbea",
  abi: [
    { indexed: true, name: "proposalIndex", type: "uint256" },
    { indexed: true, name: "applicant", type: "address" },
    { indexed: true, name: "memberAddress", type: "address" },
    { indexed: false, name: "tokenTribute", type: "uint256" },
    { indexed: false, name: "sharesRequested", type: "uint256" },
    { indexed: false, name: "didPass", type: "bool" }
  ]
};

export interface UpdateDelegateKeysParams {
  memberAddress: string;
  newDelegateKey: string;
}

export const UPDATE_DELEGATE_KEY_BLOCKCHAIN_EVENT: BlockchainEvent<UpdateDelegateKeysParams> = {
  signature: "0xde7b64a369e10562cc2e71f0f1f944eaf144b75fead6ecb51fac9c4dd6934885",
  abi: [
    { indexed: true, name: "memberAddress", type: "address" },
    { indexed: false, name: "newDelegateKey", type: "address" }
  ]
};
