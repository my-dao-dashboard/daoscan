import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { EventRecord } from "../../storage/event.record";
import { ConnectionFactory } from "../../storage/connection.factory";
import { ProposalRecord } from "../../storage/proposal.record";
import { HistoryRecord } from "../../storage/history.record";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { EventRepository } from "../../storage/event.repository";
import { HistoryRepository } from "../../storage/history.repository";
import { PROPOSAL_STATUS } from "../../domain/proposal";

export interface SubmitProposalEventProps {
  index: number;
  proposer: string;
  organisationAddress: string;

  timestamp: number;
  txid: string;
  blockNumber: number;
  blockHash: string;
  payload: object;
  platform: PLATFORM;
}

export class SubmitProposalEvent implements IScrapingEvent, SubmitProposalEventProps {
  readonly kind = SCRAPING_EVENT_KIND.SUBMIT_PROPOSAL;
  readonly timestamp = this.props.timestamp;
  readonly txid = this.props.txid;
  readonly blockNumber = this.props.blockNumber;
  readonly blockHash = this.props.blockHash;
  readonly platform = this.props.platform;

  readonly index = this.props.index;
  readonly proposer = this.props.proposer.toLowerCase();
  readonly payload = this.props.payload;
  readonly organisationAddress = this.props.organisationAddress.toLowerCase();

  constructor(
    readonly props: SubmitProposalEventProps,
    readonly connectionFactory: ConnectionFactory,
    readonly eventRepository: EventRepository,
    readonly historyRepository: HistoryRepository
  ) {}

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();

    const proposalRow = new ProposalRecord();
    proposalRow.index = this.index;
    proposalRow.organisationAddress = this.organisationAddress;
    proposalRow.proposer = this.proposer;
    proposalRow.payload = this.payload;
    proposalRow.status = PROPOSAL_STATUS.ACTIVE;
    proposalRow.createdAt = eventRow.timestamp;

    const historyRow = new HistoryRecord();
    historyRow.resourceKind = RESOURCE_KIND.PROPOSAL;

    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      const savedProposal = await entityManager.save(proposalRow);
      console.log("Saved proposal", savedProposal);
      historyRow.eventId = savedEvent.id;
      historyRow.resourceId = savedProposal.id;
      const savedHistory = await entityManager.save(historyRow);
      console.log("Saved history", savedHistory);
    });
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const historyRows = await this.historyRepository.allByEventIdAndKind(found.id, RESOURCE_KIND.PROPOSAL);
      const resourceIds = historyRows.map(h => h.resourceId.toString());
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        const deleteEvents = await entityManager.delete(EventRecord, eventRow);
        console.log(`Saved ${deleteEvents.affected} events`);
        if (historyRows.length > 0) {
          const deleteHistory = await entityManager.delete(HistoryRecord, historyRows);
          console.log(`Deleted ${deleteHistory.affected} history entries`);
        }
        if (resourceIds.length > 0) {
          const deleteProposals = await entityManager.delete(ProposalRecord, resourceIds);
          console.log(`Deleted ${deleteProposals.affected} proposals`);
        }
      });
    } else {
      console.log("Nothing to revert", eventRow);
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

  toJSON(): any {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
