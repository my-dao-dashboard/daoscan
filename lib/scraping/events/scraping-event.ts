import { OrganisationCreatedEvent } from "./organisation-created.event";
import { AppInstalledEvent } from "./app-installed.event";
import { ShareTransferEvent } from "./share-transfer.event";

export type ScrapingEvent = OrganisationCreatedEvent | AppInstalledEvent | ShareTransferEvent;
