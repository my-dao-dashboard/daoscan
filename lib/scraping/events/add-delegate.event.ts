import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { Event } from "../../storage/event.row";
import { UUID } from "../../storage/uuid";
import { ConnectionFactory } from "../../storage/connection.factory";
import { Delegate } from "../../storage/delegate.row";
import { EventRepository } from "../../storage/event.repository";
import { DelegateRepository } from "../../storage/delegate.repository";
import { History } from "../../storage/history.row";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { HistoryRepository } from "../../storage/history.repository";

export interface AddDelegateEventProps {
  platform: PLATFORM;
  address: string;
  delegateFor: string;
  organisationAddress: string;
  blockHash: string;
  blockNumber: number;
  txid: string;
  logIndex: number;
  timestamp: Date;
}

export class AddDelegateEvent implements IScrapingEvent, AddDelegateEventProps {
  readonly kind = SCRAPING_EVENT_KIND.ADD_DELEGATE;

  constructor(
    private readonly props: AddDelegateEventProps,
    private readonly connectionFactory: ConnectionFactory,
    private readonly eventRepository: EventRepository,
    private readonly delegateRepository: DelegateRepository,
    private readonly historyRepository: HistoryRepository
  ) {}

  get logIndex() {
    return this.props.logIndex;
  }

  get txid() {
    return this.props.txid;
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

  get delegateFor() {
    return this.props.delegateFor;
  }

  get organisationAddress() {
    return this.props.organisationAddress;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();

    const delegateRow = new Delegate();
    delegateRow.address = this.address;
    delegateRow.delegateFor = this.delegateFor;
    delegateRow.organisationAddress = this.organisationAddress;
    delegateRow.eventId = eventRow.id;

    const historyRow = new History();
    historyRow.resourceKind = RESOURCE_KIND.DELEGATE;

    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      const savedDelegate = await entityManager.save(delegateRow);
      console.log("Saved delegate", savedDelegate);
      historyRow.eventId = savedEvent.serialId;
      historyRow.resourceId = savedDelegate.id;
      const savedHistory = await entityManager.save(historyRow);
      console.log("Saved history", savedHistory);
    });
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();
    const foundEvent = await this.eventRepository.findSame(eventRow);
    if (foundEvent) {
      const rows = await this.delegateRepository.byEventId(foundEvent.id);
      const historyRows = await this.historyRepository.allByEventId(foundEvent.serialId, RESOURCE_KIND.DELEGATE);
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await Promise.all(
          rows.map(async row => {
            console.log("Deleting delegate", row);
            await entityManager.delete(Delegate, { id: row.eventId });
          })
        );
        await entityManager.delete(Event, foundEvent);
        console.log("Deleted event", foundEvent);
        if (historyRows.length > 0) {
          const historyIds = historyRows.map(h => h.id.toString());
          const deleteResult = await entityManager.delete(History, historyIds);
          console.log(`Deleted ${deleteResult.affected} history entries`);
        }
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
    eventRow.timestamp = this.timestamp;
    eventRow.organisationAddress = this.organisationAddress;
    eventRow.kind = this.kind;
    return eventRow;
  }

  toJSON(): any {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
