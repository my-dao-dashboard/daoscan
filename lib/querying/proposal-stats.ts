import { Proposal } from "../domain/proposal";
import { VoteRepository } from "../storage/vote.repository";
import { VOTE_DECISION } from "../domain/vote-decision";
import { Vote } from "../storage/vote.row";
import { Shares } from "../domain/shares";
import BigNumber from "bignumber.js";
import { TokenFactory } from "../domain/token.factory";

export class ProposalStats {
  constructor(
    private readonly proposal: Proposal,
    private readonly voteRepository: VoteRepository,
    private readonly tokenFactory: TokenFactory
  ) {}

  async yesVotes() {
    return this.voteRepository.countByProposalDecision(this.proposal, VOTE_DECISION.YES);
  }

  async noVotes() {
    return this.voteRepository.countByProposalDecision(this.proposal, VOTE_DECISION.NO);
  }

  async yesShares() {
    const yesVotes = await this.voteRepository.allByProposalDecision(this.proposal, VOTE_DECISION.YES);
    return this.votesToShares(yesVotes);
  }

  async noShares() {
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
