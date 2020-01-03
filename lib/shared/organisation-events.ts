import { PLATFORM } from "./platform";

export enum ORGANISATION_EVENT {
  CREATED = "CREATED",
  APP_INSTALLED = "APP_INSTALLED",
  ADD_PARTICIPANT = "ADD_PARTICIPANT",
  TRANSFER_SHARE = "TRANSFER_SHARE"
}

export interface OrganisationCreatedEvent {
  kind: ORGANISATION_EVENT.CREATED;
  platform: PLATFORM;
  name: string;
  address: string;
  txid: string;
  blockNumber: number;
  timestamp: number;
}

export interface AppInstalledEvent {
  kind: ORGANISATION_EVENT.APP_INSTALLED;
  platform: PLATFORM.ARAGON;
  organisationAddress: string;
  appId: string;
  proxyAddress: string;
  txid: string;
  blockNumber: number;
  timestamp: number;
}

export interface AddParticipantEvent {
  kind: ORGANISATION_EVENT.ADD_PARTICIPANT;
  platform: PLATFORM.ARAGON;
  organisationAddress: string;
  participant: string;
}

export interface ShareTransferEvent {
  kind: ORGANISATION_EVENT.TRANSFER_SHARE;
  platform: PLATFORM.ARAGON;
  organisationAddress: string;
  blockNumber: number;
  txid: string;
  logIndex: number;
  shareAddress: string;
  from: string;
  to: string;
  amount: string;
}

export type OrganisationEvent = OrganisationCreatedEvent | AppInstalledEvent | AddParticipantEvent | ShareTransferEvent;