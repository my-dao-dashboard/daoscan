import { Inject, Service } from "typedi";
import { Delta } from "./delta";
import { Event } from "../../storage/event.row";
import { Organisation } from "../../storage/organisation.row";
import { ConnectionFactory } from "../../storage/connection.factory";
import { OrganisationCreatedEvent } from "./scraping-event";
import crypto from "crypto";

@Service(OrganisationCreatedEventDelta.name)
export class OrganisationCreatedEventDelta implements Delta<OrganisationCreatedEvent> {
  constructor(@Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory) {}

  eventId(event: OrganisationCreatedEvent) {
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(event));
    return hash.digest("hex");
  }

  async commit(event: OrganisationCreatedEvent) {
    const eventRow = new Event();
    eventRow.id = this.eventId(event);
    eventRow.platform = event.platform;
    eventRow.blockHash = event.blockHash;
    eventRow.blockId = BigInt(event.blockNumber);
    eventRow.payload = event;

    const organisationRow = new Organisation();
    organisationRow.id = event.address.toLowerCase();
    organisationRow.name = event.name;
    organisationRow.platform = event.platform;

    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedOrganisation = await entityManager.save(organisationRow);
      console.log("Saved organisation", savedOrganisation);
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
    });
  }

  async revert(event: OrganisationCreatedEvent) {
    console.log("TODO OrganisationCreatedEventDelta.revert");
  }
}
