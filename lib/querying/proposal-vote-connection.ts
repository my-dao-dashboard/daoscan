import { Proposal } from "../domain/proposal";
import { IPagination } from "./pagination.interface";
import { VoteRepository } from "../storage/vote.repository";
import { Memoize } from "typescript-memoize";
import { VOTE_DECISION } from "../domain/vote-decision";
import { TokenFactory } from "../domain/token.factory";
import { Shares } from "../domain/shares";
import BigNumber from "bignumber.js";
import { Vote } from "../storage/vote.row";

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

  async totalYesVotes(): Promise<number> {
    return this.voteRepository.countByProposalDecision(this.proposal, VOTE_DECISION.YES);
  }

  async totalNoVotes() {
    return this.voteRepository.countByProposalDecision(this.proposal, VOTE_DECISION.NO);
  }

  async totalYesShares() {
    const yesVotes = await this.voteRepository.allByProposalDecision(this.proposal, VOTE_DECISION.YES);
    return this.votesToShares(yesVotes);
  }

  async totalNoShares() {
    const yesVotes = await this.voteRepository.allByProposalDecision(this.proposal, VOTE_DECISION.NO);
    return this.votesToShares(yesVotes);
  }

  private async votesToShares(votes: Vote[]) {
    const organisation = await this.proposal.organisation();
    const shares: Shares | undefined = await organisation?.shares();
    const sharesPerVote = await Promise.all(votes.map(async vote => shares?.balanceOf(vote.voter)));
    const sharesSum = sharesPerVote.reduce((acc, s) => (s ? acc.plus(s.toBigNumber()) : acc), new BigNumber(0));
    return this.tokenFactory.build({
      name: shares?.name,
      symbol: shares?.symbol,
      amount: sharesSum.toString(),
      decimals: shares?.decimals || 0
    });
  }
}
