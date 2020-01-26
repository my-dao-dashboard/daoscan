import { OrganisationCreatedEvent } from "./organisation-created.event";
import { AppInstalledEvent } from "./app-installed.event";

export type ScrapingEvent = OrganisationCreatedEvent | AppInstalledEvent;
