export enum ORGANISATION_PLATFORM {
  ARAGON = "ARAGON"
}

export enum ORGANISATION_EVENT {
  CREATED = "CREATED",
  APP_INSTALLED = "APP_INSTALLED",
  ADD_PARTICIPANT = "ADD_PARTICIPANT",
  TRANSFER_SHARE = "TRANSFER_SHARE"
}

export interface OrganisationCreatedEvent {
  kind: ORGANISATION_EVENT.CREATED;
  platform: ORGANISATION_PLATFORM;
  name: string;
  address: string;
  txid: string;
  blockNumber: number;
  timestamp: number;
}

export interface AppInstalledEvent {
  kind: ORGANISATION_EVENT.APP_INSTALLED;
  platform: ORGANISATION_PLATFORM.ARAGON;
  organisationAddress: string;
  appId: string;
  proxyAddress: string;
  txid: string;
  blockNumber: number;
  timestamp: number;
}

export interface AddParticipantEvent {
  kind: ORGANISATION_EVENT.ADD_PARTICIPANT;
  platform: ORGANISATION_PLATFORM.ARAGON;
  organisationAddress: string;
  participant: string;
}

export interface ShareTransferEvent {
  kind: ORGANISATION_EVENT.TRANSFER_SHARE;
  platform: ORGANISATION_PLATFORM.ARAGON;
  organisationAddress: string;
  txid: string;
  shareAddress: string;
  from: string;
  to: string;
  amount: string;
}

export type OrganisationEvent = OrganisationCreatedEvent | AppInstalledEvent | AddParticipantEvent | ShareTransferEvent;
