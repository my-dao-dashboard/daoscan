import { Inject, Service } from "typedi";
import { ProposalRecord } from "../storage/proposal.record";
import { Proposal } from "./proposal";
import { OrganisationRepository } from "./organisation.repository";

@Service(ProposalFactory.name)
export class ProposalFactory {
  constructor(@Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository) {}

  fromRecord(record: ProposalRecord) {
    return new Proposal(record, this.organisationRepository);
  }
}
