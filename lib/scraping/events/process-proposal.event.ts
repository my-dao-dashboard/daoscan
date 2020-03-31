import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { EventRecord } from "../../storage/event.record";
import { HistoryRecord } from "../../storage/history.record";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { ProposalRepository } from "../../storage/proposal.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { PROPOSAL_STATUS } from "../../domain/proposal";
import { EventRepository } from "../../storage/event.repository";
import { HistoryRepository } from "../../storage/history.repository";
import { ProposalRecord } from "../../storage/proposal.record";

interface ProcessProposalEventProps {
  index: number;
  organisationAddress: string;
  didPass: boolean;

  timestamp: number;
  txid: string;
  logIndex: number;
  blockNumber: number;
  blockHash: string;
  platform: PLATFORM;
}

export class ProcessProposalEvent implements IScrapingEvent {
  readonly kind = SCRAPING_EVENT_KIND.PROCESS_PROPOSAL;
  readonly index = this.props.index;
  readonly organisationAddress = this.props.organisationAddress.toLowerCase();
  readonly didPass = this.props.didPass;

  readonly timestamp = this.props.timestamp;
  readonly txid = this.props.txid;
  readonly logIndex = this.props.logIndex;
  readonly blockNumber = this.props.blockNumber;
  readonly blockHash = this.props.blockHash;
  readonly platform = this.props.platform;

  constructor(
    private readonly props: ProcessProposalEventProps,
    private readonly proposalRepository: ProposalRepository,
    private readonly connectionFactory: ConnectionFactory,
    private readonly eventRepository: EventRepository,
    private readonly historyRepository: HistoryRepository
  ) {}

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();
    const proposalRow = await this.proposalRepository.byOrganisationAndIndex(this.organisationAddress, this.index);
    if (proposalRow) {
      const historyRow = new HistoryRecord();
      historyRow.resourceKind = RESOURCE_KIND.PROPOSAL;
      const nextStatus = this.didPass ? PROPOSAL_STATUS.PASS : PROPOSAL_STATUS.REJECT;
      historyRow.delta = {
        before: {
          status: proposalRow.status
        },
        after: {
          status: nextStatus
        }
      };
      proposalRow.status = nextStatus;
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
    } else {
      console.warn(`No proposal ${this.index} of ${this.organisationAddress} found`);
    }
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const historyRows = await this.historyRepository.allByEventIdAndKind(found.id, RESOURCE_KIND.PROPOSAL);
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await entityManager.delete(EventRecord, found);
        for (let h of historyRows) {
          if (h.delta) {
            const proposal = await entityManager.findOne(ProposalRecord, { id: h.resourceId });
            if (proposal) {
              proposal.status = h.delta.before.status;
              await entityManager.save(proposal);
            }
          }
          await entityManager.delete(HistoryRecord, h);
        }
      });
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
