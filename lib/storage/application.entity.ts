import {ORGANISATION_PLATFORM} from "../organisation-events";

export interface ApplicationEntity {
  platform: ORGANISATION_PLATFORM;
  organisationAddress: string;
  appId: string;
  proxyAddress: string;
  txid: string;
  blockNumber: number;
  timestamp: number;
}
