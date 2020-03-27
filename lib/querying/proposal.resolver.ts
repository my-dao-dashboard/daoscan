import { Inject, Service } from "typedi";
import { bind } from "decko";
import { Proposal } from "../domain/proposal";
import { VoteRepository } from "../storage/vote.repository";
import { ProposalVoteConnection } from "./proposal-vote-connection";
import { IPagination } from "./pagination.interface";
import { TokenFactory } from "../domain/token.factory";
import { ProposalStats } from "./proposal-stats";

@Service(ProposalResolver.name)
export class ProposalResolver {
  constructor(
    @Inject(VoteRepository.name) private readonly voteRepository: VoteRepository,
    @Inject(TokenFactory.name) private readonly tokenFactory: TokenFactory
  ) {}

  @bind()
  async votes(root: Proposal, args: { page?: IPagination }) {
    return new ProposalVoteConnection(root, args.page, this.tokenFactory, this.voteRepository);
  }

  @bind()
  async stats(root: Proposal) {
    return new ProposalStats(root, this.voteRepository, this.tokenFactory);
  }
}
