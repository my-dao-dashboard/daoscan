import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { IScrapingEvent } from "./scraping-event.interface";
import { Event } from "../../storage/event.row";
import { UUID } from "../../storage/uuid";
import { Organisation } from "../../storage/organisation.row";
import { EventRepository } from "../../storage/event.repository";
import { ConnectionFactory } from "../../storage/connection.factory";

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
    const eventRow = new Event();
    eventRow.id = new UUID();
    eventRow.platform = this.platform;
    eventRow.blockHash = this.blockHash;
    eventRow.blockId = BigInt(this.blockNumber);
    eventRow.payload = this;
    const found = await this.eventRepository.findSame(eventRow);
    if (Boolean(found)) {
      console.log("Already committed", this);
    } else {
      const organisationRow = new Organisation();
      organisationRow.id = this.address.toLowerCase();
      organisationRow.name = this.name;
      organisationRow.platform = this.platform;

      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        const savedOrganisation = await entityManager.save(organisationRow);
        console.log("Saved organisation", savedOrganisation);
        const savedEvent = await entityManager.save(eventRow);
        console.log("Saved event", savedEvent);
      });
    }
  }

  toJSON() {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
