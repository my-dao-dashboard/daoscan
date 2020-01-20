import { Inject, Service } from "typedi";
import { Delta } from "./delta";
import { Event } from "../../storage/event.row";
import { Organisation } from "../../storage/organisation.row";
import { ConnectionFactory } from "../../storage/connection.factory";
import { OrganisationCreatedEvent } from "./scraping-event";
import { UUID } from "../../storage/uuid";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationRepository } from "../../storage/organisation.repository";

@Service(OrganisationCreatedEventDelta.name)
export class OrganisationCreatedEventDelta implements Delta<OrganisationCreatedEvent> {
  constructor(
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository
  ) {}

  async commit(event: OrganisationCreatedEvent): Promise<void> {
    const eventRow = new Event();
    eventRow.id = new UUID();
    eventRow.platform = event.platform;
    eventRow.blockHash = event.blockHash;
    eventRow.blockId = BigInt(event.blockNumber);
    eventRow.payload = event;
    const found = await this.eventRepository.findSame(eventRow);
    if (Boolean(found)) {
      console.log("Already committed", event);
    } else {
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
  }

  async revert(event: OrganisationCreatedEvent): Promise<void> {
    const eventRow = new Event();
    eventRow.id = new UUID();
    eventRow.platform = event.platform;
    eventRow.blockHash = event.blockHash;
    eventRow.blockId = BigInt(event.blockNumber);
    eventRow.payload = event;
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const organisationRow = await this.organisationRepository.byId(event.address);
      if (organisationRow) {
        const writing = await this.connectionFactory.writing();
        await writing.transaction(async entityManager => {
          await entityManager.delete(Organisation, { id: event.address });
          console.log("Deleted organisation", organisationRow);
          await entityManager.delete(Event, { id: found.id });
          console.log("Deleted event", found);
        });
      } else {
        console.log("Can not find organisation", event);
      }
    } else {
      console.log("Can not find event", event);
    }
  }
}
