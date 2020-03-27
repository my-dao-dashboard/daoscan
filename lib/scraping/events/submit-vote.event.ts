import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { History } from "../../storage/history.row";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { Event } from "../../storage/event.row";
import { VOTE_DECISION } from "../../domain/vote-decision";
import { Vote } from "../../storage/vote.row";
import { ConnectionFactory } from "../../storage/connection.factory";
import { EventRepository } from "../../storage/event.repository";
import { HistoryRepository } from "../../storage/history.repository";

interface SubmitVoteEventProps {
  platform: PLATFORM;
  organisationAddress: string;
  voter: string;
  proposalIndex: number;
  timestamp: number;
  txid: string;
  blockNumber: number;
  blockHash: string;
  decision: VOTE_DECISION;
}

export class SubmitVoteEvent implements IScrapingEvent, SubmitVoteEventProps {
  readonly kind = SCRAPING_EVENT_KIND.SUBMIT_VOTE;
  readonly organisationAddress = this.props.organisationAddress.toLowerCase();
  readonly voter = this.props.voter.toLowerCase();
  readonly proposalIndex = this.props.proposalIndex;
  readonly timestamp = this.props.timestamp;
  readonly txid = this.props.txid;
  readonly blockNumber = this.props.blockNumber;
  readonly blockHash = this.props.blockHash;
  readonly platform = this.props.platform;
  readonly decision = this.props.decision;

  constructor(
    private readonly props: SubmitVoteEventProps,
    private readonly connectionFactory: ConnectionFactory,
    private readonly eventRepository: EventRepository,
    private readonly historyRepository: HistoryRepository
  ) {}

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();

    const voteRow = new Vote();
    voteRow.decision = this.decision;
    voteRow.organisationAddress = this.organisationAddress;
    voteRow.proposalIndex = this.proposalIndex;
    voteRow.voter = this.voter;
    voteRow.createdAt = eventRow.timestamp;

    const historyRow = new History();
    historyRow.resourceKind = RESOURCE_KIND.VOTE;
    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      const savedVote = await entityManager.save(voteRow);
      console.log("Saved vote", savedVote);
      historyRow.eventId = savedEvent.id;
      historyRow.resourceId = savedVote.id;
      const savedHistory = await entityManager.save(historyRow);
      console.log("Saved history", savedHistory);
    });
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const historyRows = await this.historyRepository.allByEventIdAndKind(found.id, RESOURCE_KIND.VOTE);
      const resourceIds = historyRows.map(h => h.resourceId.toString());
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        const deleteEvents = await entityManager.delete(Event, eventRow);
        console.log(`Saved ${deleteEvents.affected} events`);
        if (historyRows.length > 0) {
          const deleteHistory = await entityManager.delete(History, historyRows);
          console.log(`Deleted ${deleteHistory.affected} history entries`);
        }
        if (resourceIds.length > 0) {
          const deleteProposals = await entityManager.delete(Vote, resourceIds);
          console.log(`Deleted ${deleteProposals.affected} votes`);
        }
      });
    } else {
      console.log("Nothing to revert", eventRow);
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

  toJSON(): any {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
