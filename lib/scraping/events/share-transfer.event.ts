import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { Event } from "../../storage/event.row";
import { EventRepository } from "../../storage/event.repository";
import { Membership } from "../../storage/membership.row";
import { MEMBERSHIP_KIND } from "../../storage/membership.kind";
import { MembershipRepository } from "../../storage/membership.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { ZERO_ADDRESS } from "../../shared/zero-address";
import { HistoryRepository } from "../../storage/history.repository";
import { History } from "../../storage/history.row";
import { RESOURCE_KIND } from "../../storage/resource.kind";

export interface ShareTransferEventProps {
  platform: PLATFORM;
  organisationAddress: string;
  blockHash: string;
  blockNumber: number;
  txid: string;
  logIndex: number;
  shareAddress: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

export class ShareTransferEvent implements IScrapingEvent, ShareTransferEventProps {
  readonly kind = SCRAPING_EVENT_KIND.SHARE_TRANSFER;
  constructor(
    private readonly props: ShareTransferEventProps,
    private readonly eventRepository: EventRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly connectionFactory: ConnectionFactory
  ) {}

  get platform() {
    return this.props.platform;
  }

  get organisationAddress() {
    return this.props.organisationAddress;
  }

  get blockHash() {
    return this.props.blockHash;
  }

  get blockNumber() {
    return this.props.blockNumber;
  }

  get txid() {
    return this.props.txid;
  }

  get logIndex() {
    return this.props.logIndex;
  }

  get shareAddress() {
    return this.props.shareAddress;
  }

  get from() {
    return this.props.from;
  }

  get to() {
    return this.props.to;
  }

  get amount() {
    return this.props.amount;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();
    const fromRow = await this.fromRow();
    const toRow = await this.toRow();
    const fromHistory = new History();
    fromHistory.resourceKind = RESOURCE_KIND.MEMBERSHIP;
    const toHistory = new History();
    toHistory.resourceKind = RESOURCE_KIND.MEMBERSHIP;
    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      if (fromRow.accountAddress !== ZERO_ADDRESS) {
        const savedFromRow = await entityManager.save(fromRow);
        console.log("Saved from", savedFromRow);
        fromHistory.resourceId = savedFromRow.id;
        fromHistory.eventId = savedEvent.serialId;
        const savedFromHistory = await entityManager.save(fromHistory);
        console.log("Saved history entry", savedFromHistory);
      }
      if (toRow.accountAddress !== ZERO_ADDRESS) {
        const savedToRow = await entityManager.save(toRow);
        console.log("Saved to", savedToRow);
        toHistory.resourceId = toRow.id;
        toHistory.eventId = savedEvent.serialId;
        const savedToHistory = await entityManager.save(toHistory);
        console.log("Saved history entry", savedToHistory);
      }
    });
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();

    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const historyRows = await this.historyRepository.allByEventId(found.serialId, RESOURCE_KIND.MEMBERSHIP);
      const resourceIds = historyRows.map(h => h.resourceId.toString());
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await entityManager.delete(Membership, resourceIds);
        console.log("Deleted memberships", resourceIds);
        await entityManager.delete(Event, found);
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
    eventRow.platform = this.platform;
    eventRow.blockHash = this.blockHash;
    eventRow.blockId = BigInt(this.blockNumber);
    eventRow.payload = this;
    eventRow.timestamp = new Date(this.timestamp * 1000);
    eventRow.organisationAddress = this.organisationAddress;
    eventRow.kind = this.kind;
    return eventRow;
  }

  async toRow() {
    const toRow = new Membership();
    toRow.accountAddress = this.to;
    toRow.organisationAddress = this.organisationAddress;
    toRow.balanceDelta = BigInt(this.amount);
    toRow.kind = MEMBERSHIP_KIND.PARTICIPANT;
    return toRow;
  }

  async fromRow() {
    const fromRow = new Membership();
    fromRow.accountAddress = this.from;
    fromRow.organisationAddress = this.organisationAddress;
    fromRow.balanceDelta = BigInt(this.amount) * BigInt(-1);
    fromRow.kind = MEMBERSHIP_KIND.PARTICIPANT;
    return fromRow;
  }

  toJSON(): any {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
