export enum ORGANISATION_PLATFORM {
  ARAGON = "ARAGON"
}

export enum ORGANISATION_EVENT {
  CREATED = "CREATED"
}

export interface OrganisationCreatedEvent {
  kind: ORGANISATION_EVENT.CREATED;
  platform: ORGANISATION_PLATFORM;
  name: string;
  address: string;
  txid: string;
}

export type OrganisationEvent = OrganisationCreatedEvent
