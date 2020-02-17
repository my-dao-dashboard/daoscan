import { Inject, Service } from "typedi";
import { bind } from "decko";
import { Proposal } from "../domain/proposal";
import { VoteRepository } from "../storage/vote.repository";
import { VoteFactory } from "../domain/vote.factory";

@Service(ProposalResolver.name)
export class ProposalResolver {
  constructor(
    @Inject(VoteRepository.name) private readonly voteRepository: VoteRepository,
    @Inject(VoteFactory.name) private readonly voteFactory: VoteFactory
  ) {}

  @bind()
  async votes(root: Proposal) {
    const rows = await this.voteRepository.allByProposal(root.index, root.organisationAddress);
    const promised = rows.map(async r => this.voteFactory.fromRow(r));
    const result = await Promise.all(promised);
    console.log("votes", rows, result);
    return result;
  }
}
