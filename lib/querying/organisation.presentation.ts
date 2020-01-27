import { Organisation } from "../storage/organisation.row";
import { OrganisationCreatedEvent } from "../scraping/events/organisation-created.event";

export class OrganisationPresentation {
  readonly address = this.organisation.address;
  readonly platform = this.organisation.platform;
  readonly name = this.organisation.name;
  readonly txid = this.event.txid;
  readonly timestamp = this.event.timestamp;
  readonly blockNumber = this.event.blockNumber;

  constructor(private readonly organisation: Organisation, private readonly event: OrganisationCreatedEvent) {}
}
