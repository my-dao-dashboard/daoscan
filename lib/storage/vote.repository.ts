import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Vote } from "./vote.row";
import { VOTE_DECISION } from "../domain/vote-decision";

interface Proposal {
  organisationAddress: string;
  index: number;
}

@Service(VoteRepository.name)
export class VoteRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async countByProposal(proposal: Proposal) {
    const repository = await this.repositoryFactory.reading(Vote);
    return repository.count({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress
      }
    });
  }

  async countByProposalDecision(proposal: Proposal, decision: VOTE_DECISION) {
    const repository = await this.repositoryFactory.reading(Vote);
    return repository.count({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress,
        decision: decision
      }
    });
  }

  async allByProposalDecision(proposal: Proposal, decision: VOTE_DECISION) {
    const repository = await this.repositoryFactory.reading(Vote);
    return repository.find({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress,
        decision: decision
      },
      order: {
        proposalIndex: "ASC"
      }
    });
  }

  async allByProposal(proposal: Proposal): Promise<Vote[]> {
    const repository = await this.repositoryFactory.reading(Vote);
    return repository.find({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress
      },
      order: {
        proposalIndex: "ASC"
      }
    });
  }

  async toProcess(limit: number): Promise<Vote[]> {
    const repository = await this.repositoryFactory.reading(Vote);
    return repository
      .createQueryBuilder("p")
      .where("p.createdAt < '1980-01-01'")
      .take(limit)
      .getMany();
  }

  async save(vote: Vote): Promise<Vote> {
    const repository = await this.repositoryFactory.writing(Vote);
    return repository.save(vote);
  }
}
