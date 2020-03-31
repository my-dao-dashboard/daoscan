import { Inject, Service } from "typedi";
import { ProposalRecord as ProposalRow } from "../storage/proposal.record";
import { Proposal } from "./proposal";
import { OrganisationRepository } from "./organisation.repository";

@Service(ProposalFactory.name)
export class ProposalFactory {
  constructor(@Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository) {}

  fromRow(row: ProposalRow) {
    return new Proposal(
      {
        index: row.index,
        proposer: row.proposer,
        createdAt: row.createdAt,
        payload: row.payload,
        organisationAddress: row.organisationAddress,
        status: row.status
      },
      this.organisationRepository
    );
  }
}
