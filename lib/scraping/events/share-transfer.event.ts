import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { Event } from "../../storage/event.row";
import { EventRepository } from "../../storage/event.repository";
import { Membership } from "../../storage/membership.row";
import { UUID } from "../../storage/uuid";
import { MEMBERSHIP_KIND } from "../../storage/membership.kind";
import { MembershipRepository } from "../../storage/membership.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { ZERO_ADDRESS } from "../../shared/zero-address";

export interface ShareTransferEventProps {
  platform: PLATFORM.ARAGON;
  organisationAddress: string;
  blockHash: string;
  blockNumber: number;
  txid: string;
  logIndex: number;
  shareAddress: string;
  from: string;
  to: string;
  amount: string;
}

export class ShareTransferEvent implements IScrapingEvent {
  readonly kind = SCRAPING_EVENT_KIND.SHARE_TRANSFER;
  constructor(
    private readonly props: ShareTransferEventProps,
    private readonly eventRepository: EventRepository,
    private readonly membershipRepository: MembershipRepository,
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

  async commit(): Promise<void> {
    const eventRow = new Event();
    eventRow.id = new UUID();
    eventRow.platform = this.platform;
    eventRow.blockHash = this.blockHash;
    eventRow.blockId = BigInt(this.blockNumber);
    eventRow.payload = this;
    const fromRow = await this.fromRow();
    const toRow = await this.toRow();
    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      if (fromRow.accountAddress !== ZERO_ADDRESS) {
        fromRow.eventId = savedEvent.id;
        const savedFromRow = await entityManager.save(fromRow);
        console.log("Saved from", savedFromRow);
      }
      if (toRow.accountAddress !== ZERO_ADDRESS) {
        toRow.eventId = savedEvent.id;
        const savedToRow = await entityManager.save(toRow);
        console.log("Saved to", savedToRow);
      }
    });
  }

  async revert(): Promise<void> {
    const eventRow = new Event();
    eventRow.id = new UUID();
    eventRow.platform = this.platform;
    eventRow.blockHash = this.blockHash;
    eventRow.blockId = BigInt(this.blockNumber);
    eventRow.payload = this;
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const rows = await this.membershipRepository.byEventId(found.id);
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await Promise.all(
          rows.map(async row => {
            console.log("Deleting membership", row);
            await entityManager.delete(Membership, row);
          })
        );
        await entityManager.delete(Event, found);
      });
    } else {
      console.log("Can not find event", this);
    }
  }

  async toRow() {
    const toRow = new Membership();
    toRow.id = new UUID();
    toRow.accountAddress = this.to;
    toRow.organisationAddress = this.organisationAddress;
    toRow.balanceDelta = BigInt(this.amount);
    toRow.kind = MEMBERSHIP_KIND.PARTICIPANT;
    return toRow;
  }

  async fromRow() {
    const fromRow = new Membership();
    fromRow.id = new UUID();
    fromRow.accountAddress = this.from;
    fromRow.organisationAddress = this.organisationAddress;
    fromRow.balanceDelta = BigInt(this.amount);
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
