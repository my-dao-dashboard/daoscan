import { ORGANISATION_PLATFORM } from "../organisation-events";

export interface OrganisationEntity {
  address: string;
  name: string;
  platform: ORGANISATION_PLATFORM;
  txid: string;
  timestamp: number;
  blockNumber: number;
}
