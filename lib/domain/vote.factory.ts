import { Inject, Service } from "typedi";
import { Vote as VoteRow } from "../storage/vote.row";
import { Vote } from "./vote";
import { HistoryRepository } from "../storage/history.repository";
import { EventRepository } from "../storage/event.repository";
import { MembershipRepository } from "../storage/membership.repository";
import { OrganisationService } from "./organisation.service";
import { OrganisationFactory } from "./organisation.factory";

@Service(VoteFactory.name)
export class VoteFactory {
  constructor(
    @Inject(HistoryRepository.name) private readonly historyRepository: HistoryRepository,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationFactory.name) private readonly organisationFactory: OrganisationFactory
  ) {}

  async fromRow(row: VoteRow) {
    const history = await this.historyRepository.forVote(row.id);
    const event = await this.eventRepository.byIdOrFail(history.eventId);
    const organisation = await this.organisationFactory.byAddress(row.organisationAddress);
    const participant = await organisation?.participant(row.voter);
    return new Vote({
      createdAt: event.timestamp,
      voter: participant,
      decision: row.decision,
      organisationAddress: row.organisationAddress
    });
  }
}
