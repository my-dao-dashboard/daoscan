import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { IScrapingEvent } from "./scraping-event.interface";
import { Event } from "../../storage/event.row";
import { Organisation } from "../../storage/organisation.row";
import { EventRepository } from "../../storage/event.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { RESOURCE_KIND } from "../../storage/resource.kind";

export interface OrganisationCreatedEventProps {
  blockNumber: number;
  blockHash: string;
  platform: PLATFORM;
  timestamp: number;
  txid: string;
  name: string;
  address: string;
}

export class OrganisationCreatedEvent implements IScrapingEvent {
  readonly kind = SCRAPING_EVENT_KIND.ORGANISATION_CREATED;
  private readonly props: OrganisationCreatedEventProps;

  constructor(
    props: OrganisationCreatedEventProps,
    private readonly eventRepository: EventRepository,
    private readonly organisationRepository: OrganisationRepository,
    private readonly connectionFactory: ConnectionFactory
  ) {
    this.props = props;
  }

  get platform() {
    return this.props.platform;
  }

  get blockHash() {
    return this.props.blockHash;
  }

  get blockNumber() {
    return this.props.blockNumber;
  }

  get address() {
    return this.props.address;
  }

  get name() {
    return this.props.name;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  get txid() {
    return this.props.txid;
  }

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();

    const organisationRow = new Organisation();
    organisationRow.name = this.name;
    organisationRow.platform = this.platform;
    organisationRow.address = this.address;

    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      organisationRow.eventId = savedEvent.id;
      const savedOrganisation = await entityManager.save(organisationRow);
      console.log("Saved organisation", savedOrganisation);
    });
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await entityManager.delete(Event, found);
        console.log("Deleted event", found);
        const deleteResult = await entityManager.delete(Organisation, { eventId: found.id });
        console.log(`Deleted ${deleteResult.affected} organisations`);
      });
    } else {
      console.log("Can not find event", this);
    }
  }

  buildEventRow() {
    const eventRow = new Event();
    eventRow.platform = this.platform;
    eventRow.blockHash = this.blockHash;
    eventRow.blockId = BigInt(this.blockNumber);
    eventRow.payload = this;
    eventRow.timestamp = new Date(this.timestamp * 1000);
    eventRow.organisationAddress = this.address;
    eventRow.kind = this.kind;
    return eventRow;
  }

  toJSON() {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
