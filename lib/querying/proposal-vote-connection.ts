import { Proposal } from "../domain/proposal";
import { IPagination } from "./pagination.interface";
import { VoteRepository } from "../storage/vote.repository";
import { TokenFactory } from "../domain/token.factory";

export class ProposalVoteConnection {
  private readonly page: IPagination;

  constructor(
    readonly proposal: Proposal,
    page: IPagination | undefined,
    private readonly tokenFactory: TokenFactory,
    private readonly voteRepository: VoteRepository
  ) {
    this.page = page || {};
  }

  async totalCount(): Promise<number> {
    return this.voteRepository.countByProposal(this.proposal);
  }
}
