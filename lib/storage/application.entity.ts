import { PLATFORM } from "../shared/platform";

export interface ApplicationEntity {
  platform: PLATFORM;
  organisationAddress: string;
  appId: string;
  proxyAddress: string;
  txid: string;
  blockNumber: number;
  timestamp: number;
}
