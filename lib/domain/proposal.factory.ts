import { Inject, Service } from "typedi";
import { Proposal as ProposalRow } from "../storage/proposal.row";
import { Proposal } from "./proposal";
import { HistoryRepository } from "../storage/history.repository";
import { EventRepository } from "../storage/event.repository";

@Service(ProposalFactory.name)
export class ProposalFactory {
  constructor(
    @Inject(HistoryRepository.name) private readonly historyRepository: HistoryRepository,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository
  ) {}

  async fromRow(row: ProposalRow) {
    const historyRow = await this.historyRepository.forProposal(row.id);
    const eventRow = await this.eventRepository.byIdOrFail(historyRow.eventId);
    return new Proposal({
      index: row.index,
      proposer: row.proposer,
      createdAt: eventRow.timestamp,
      payload: row.payload,
      organisationAddress: row.organisationAddress
    });
  }
}
