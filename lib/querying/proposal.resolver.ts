import { Inject, Service } from "typedi";
import { bind } from "decko";
import { Proposal } from "../domain/proposal";
import { VoteRepository } from "../storage/vote.repository";
import { VoteFactory } from "../domain/vote.factory";
import { ProposalVoteConnection } from "./proposal-vote-connection";
import { IPagination } from "./pagination.interface";
import { MessariService } from "./messari.service";
import { TokenFactory } from "../domain/token.factory";

@Service(ProposalResolver.name)
export class ProposalResolver {
  constructor(
    @Inject(VoteRepository.name) private readonly voteRepository: VoteRepository,
    @Inject(TokenFactory.name) private readonly tokenFactory: TokenFactory
  ) {}

  @bind()
  async votes(root: Proposal, args: { page?: IPagination }) {
    return new ProposalVoteConnection(root, args.page, this.tokenFactory, this.voteRepository);
    // const rows = await this.voteRepository.allByProposal(root.index, root.organisationAddress);
    // const promised = rows.map(async r => this.voteFactory.fromRow(r));
    // const result = await Promise.all(promised);
    // return result;
  }
}
