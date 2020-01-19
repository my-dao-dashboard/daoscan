import { Inject, Service } from "typedi";
import { OrganisationCreatedEvent } from "./event";
import { Delta } from "./delta";
import { Event } from "../../storage/event.row";
import { Organisation } from "../../storage/organisation.row";
import { ConnectionFactory } from "../../storage/connection.factory";
import uuid from "uuid/v4";

@Service(OrganisationCreatedEventDelta.name)
export class OrganisationCreatedEventDelta implements Delta<OrganisationCreatedEvent> {
  constructor(@Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory) {}

  async commit(event: OrganisationCreatedEvent) {
    const eventRow = new Event();
    eventRow.id = uuid();
    eventRow.platform = event.platform;
    eventRow.blockHash = event.blockHash;
    eventRow.blockId = event.blockNumber;
    eventRow.kind = event.kind;
    eventRow.payload = event;

    const organisationRow = new Organisation();
    organisationRow.id = event.address.toLowerCase();
    organisationRow.name = event.name;
    organisationRow.platform = event.platform;

    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      await entityManager.save(organisationRow);
      await entityManager.save(eventRow);
    });
  }

  async revert(event: OrganisationCreatedEvent) {}
}
