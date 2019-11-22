export enum ORGANISATION_PLATFORM {
  ARAGON = "ARAGON"
}

export enum ORGANISATION_EVENT {
  CREATED = "CREATED",
  APP_INSTALLED = "APP_INSTALLED"
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

export type OrganisationEvent = OrganisationCreatedEvent | AppInstalledEvent;
