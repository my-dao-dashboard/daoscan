import { PLATFORM } from "../shared/platform";

export interface OrganisationEntity {
  address: string;
  name: string;
  platform: PLATFORM;
  txid: string;
  timestamp: number;
  blockNumber: number;
}
