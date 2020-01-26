import { OrganisationCreatedEvent } from "./organisation-created.event";
import { AppInstalledEvent } from "./app-installed.event";

// interface Event {
//   kind: SCRAPING_EVENT_KIND;
//   platform: PLATFORM;
//   blockNumber: number;
//   blockHash: string;
//   timestamp: number;
//   txid: string;
// }

// export class OrganisationCreatedEvent implements Event {
//   readonly kind = SCRAPING_EVENT_KIND.ORGANISATION_CREATED;
//   readonly blockNumber: number;
//   readonly blockHash: string;
//   readonly platform: PLATFORM;
//   readonly timestamp: number;
//   readonly txid: string;
//   readonly name: string;
//   readonly address: string;
// }

// export interface OrganisationCreatedEvent extends Event {
//   kind: SCRAPING_EVENT_KIND.ORGANISATION_CREATED;
//   name: string;
//   address: string;
// }

// export interface AppInstalledEvent extends Event {
//   kind: SCRAPING_EVENT_KIND.APP_INSTALLED;
//   organisationAddress: string;
//   appId: string;
//   proxyAddress: string;
// }

export type ScrapingEvent = OrganisationCreatedEvent | AppInstalledEvent;
