import { OrganisationCreatedEvent } from "./organisation-created.event";

// interface Event {
//   kind: SCRAPING_EVENT_KIND;
//   platform: PLATFORM;
//   blockNumber: number;
//   blockHash: string;
//   timestamp: number;
//   txid: string;
// }
//
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

// export type ScrapingEvent = OrganisationCreatedEvent | AppInstalledEvent;

export type ScrapingEvent = OrganisationCreatedEvent;
