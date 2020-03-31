import { Inject, Service } from "typedi";
import { Proposal as ProposalRow } from "../storage/proposal.row";
import { Proposal } from "./proposal";
import { OrganisationFactory } from "./organisation.factory";

@Service(ProposalFactory.name)
export class ProposalFactory {
  constructor(@Inject(OrganisationFactory.name) private readonly organisationFactory: OrganisationFactory) {}

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
      this.organisationFactory
    );
  }
}
