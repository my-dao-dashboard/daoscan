import { PLATFORM } from "../../domain/platform";

export enum SCRAPING_EVENT_KIND {
  ORGANISATION_CREATED = "ORGANISATION_CREATED",
  APP_INSTALLED = "APP_INSTALLED"
}

export interface IScrapingEvent {
  kind: SCRAPING_EVENT_KIND;
  platform: PLATFORM;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  txid: string;
}
