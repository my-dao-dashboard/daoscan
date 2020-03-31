import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { EventRecord } from "../../storage/event.record";
import { EventRepository } from "../../storage/event.repository";
import { MembershipRecord } from "../../storage/membership.record";
import { MEMBERSHIP_KIND } from "../../storage/membership.kind";
import { MembershipRepository } from "../../storage/membership.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { ZERO_ADDRESS } from "../../shared/zero-address";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { HistoryRepository } from "../../storage/history.repository";
import { HistoryRecord } from "../../storage/history.record";
import { EntityManager } from "typeorm";

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
  readonly platform = this.props.platform;
  readonly organisationAddress = this.props.organisationAddress;
  readonly blockHash = this.props.blockHash;
  readonly blockNumber = this.props.blockNumber;
  readonly txid = this.props.txid;
  readonly logIndex = this.props.logIndex;
  readonly shareAddress = this.props.shareAddress;
  readonly from = this.props.from;
  readonly to = this.props.to;
  readonly amount = this.props.amount;
  readonly timestamp = this.props.timestamp;

  constructor(
    private readonly props: ShareTransferEventProps,
    private readonly eventRepository: EventRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly connectionFactory: ConnectionFactory,
    private readonly historyRepository: HistoryRepository
  ) {}

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();
    const fromRow = await this.fromRow();
    const toRow = await this.toRow();
    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      if (fromRow.accountAddress !== ZERO_ADDRESS) {
        const savedFromRow = await entityManager.save(fromRow);
        console.log("Saved from", savedFromRow);
        await this.saveHistory(entityManager, savedEvent, savedFromRow);
      }
      if (toRow.accountAddress !== ZERO_ADDRESS) {
        const savedToRow = await entityManager.save(toRow);
        console.log("Saved to", savedToRow);
        await this.saveHistory(entityManager, savedEvent, savedToRow);
      }
    });
  }

  async saveHistory(em: EntityManager, event: EventRecord, row: MembershipRecord) {
    const history = new HistoryRecord();
    history.resourceKind = RESOURCE_KIND.MEMBERSHIP;
    history.resourceId = row.id;
    history.eventId = event.id;
    const saved = await em.save(HistoryRecord, history);
    console.log("Saved history", saved);
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();

    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await entityManager.delete(EventRecord, found);
        console.log("Deleted event", found);
        const historyRows = await this.historyRepository.allByEventIdAndKind(found.id, RESOURCE_KIND.MEMBERSHIP);
        const resourceIds = historyRows.map(h => h.resourceId.toString());
        if (resourceIds.length > 0) {
          const deleteMemberships = await entityManager.delete(MembershipRecord, resourceIds);
          console.log("Deleted  memberships", deleteMemberships);
        }
        const deleteHistories = await entityManager.delete(HistoryRecord, { eventId: found.id });
        console.log(`Removed ${deleteHistories.affected} histories`);
      });
    } else {
      console.log("Can not find event", this);
    }
  }

  buildEventRow() {
    const eventRow = new EventRecord();
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
    const toRow = new MembershipRecord();
    toRow.accountAddress = this.to;
    toRow.organisationAddress = this.organisationAddress;
    toRow.balanceDelta = BigInt(this.amount);
    toRow.kind = MEMBERSHIP_KIND.PARTICIPANT;
    return toRow;
  }

  async fromRow() {
    const fromRow = new MembershipRecord();
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
