import { Inject, Service } from "typedi";
import { VoteRecord } from "../storage/vote.record";
import { Vote } from "./vote";
import { OrganisationRepository } from "./organisation.repository";

@Service(VoteFactory.name)
export class VoteFactory {
  constructor(@Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository) {}

  async fromRecord(record: VoteRecord) {
    const organisation = await this.organisationRepository.byAddress(record.organisationAddress);
    const participant = await organisation?.participant(record.voter);
    return new Vote({
      createdAt: record.createdAt,
      voter: participant,
      decision: record.decision,
      organisationAddress: record.organisationAddress
    });
  }
}
