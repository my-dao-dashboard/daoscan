import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { IScrapingEvent } from "./scraping-event.interface";
import { Event } from "../../storage/event.row";
import { UUID } from "../../storage/uuid";
import { Organisation } from "../../storage/organisation.row";
import { EventRepository } from "../../storage/event.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { History } from "../../storage/history.row";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { HistoryRepository } from "../../storage/history.repository";

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
    private readonly historyRepository: HistoryRepository,
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
    organisationRow.eventId = eventRow.id;
    organisationRow.name = this.name;
    organisationRow.platform = this.platform;
    organisationRow.address = this.address;

    const historyRow = new History();
    historyRow.resourceKind = RESOURCE_KIND.ORGANISATION;

    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedOrganisation = await entityManager.save(organisationRow);
      console.log("Saved organisation", savedOrganisation);
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      historyRow.eventId = savedEvent.serialId;
      historyRow.resourceId = savedOrganisation.id;
      console.log("historyRow", historyRow);
      const savedHistory = await entityManager.save(historyRow);
      console.log("Saved history", savedHistory);
    });
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const organisationRow = await this.organisationRepository.byId(found.id);
      const historyRows = await this.historyRepository.byEventId(found.serialId);
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        if (organisationRow) {
          await entityManager.delete(Organisation, organisationRow);
          console.log("Deleted organisation", organisationRow);
        }
        if (historyRows.length > 0) {
          const historyIds = historyRows.map(h => h.id.toString());
          const deleteResult = await entityManager.delete(History, historyIds);
          console.log(`Deleted ${String(deleteResult.affected)} history entries`);
        }
        await entityManager.delete(Event, found);
        console.log("Deleted event", found);
      });
    } else {
      console.log("Can not find event", this);
    }
  }

  buildEventRow() {
    const eventRow = new Event();
    eventRow.id = new UUID();
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
