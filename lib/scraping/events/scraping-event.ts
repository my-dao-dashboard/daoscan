import { OrganisationCreatedEvent } from "./organisation-created.event";
import { AppInstalledEvent } from "./app-installed.event";
import { ShareTransferEvent } from "./share-transfer.event";
import { AddDelegateEvent } from "./add-delegate.event";
import { SetOrganisationNameEvent } from "./set-organisation-name.event";
import { SubmitProposalEvent } from "./submit-proposal.event";

export type ScrapingEvent =
  | OrganisationCreatedEvent
  | AppInstalledEvent
  | ShareTransferEvent
  | AddDelegateEvent
  | SetOrganisationNameEvent
  | SubmitProposalEvent;
