import { Inject, Service } from "typedi";
import { Vote as VoteRow } from "../storage/vote.row";
import { Vote } from "./vote";
import { OrganisationFactory } from "./organisation.factory";

@Service(VoteFactory.name)
export class VoteFactory {
  constructor(@Inject(OrganisationFactory.name) private readonly organisationFactory: OrganisationFactory) {}

  async fromRow(row: VoteRow) {
    const organisation = await this.organisationFactory.byAddress(row.organisationAddress);
    const participant = await organisation?.participant(row.voter);
    return new Vote({
      createdAt: row.createdAt,
      voter: participant,
      decision: row.decision,
      organisationAddress: row.organisationAddress
    });
  }
}
