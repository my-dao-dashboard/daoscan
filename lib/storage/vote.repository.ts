import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Proposal } from "./proposal.row";
import { Vote } from "./vote.row";

@Service(VoteRepository.name)
export class VoteRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async allByProposal(proposalIndex: number, organisationAddress: string): Promise<Vote[]> {
    const repository = await this.repositoryFactory.reading(Vote);
    return repository.find({
      where: {
        proposalIndex,
        organisationAddress
      },
      order: {
        proposalIndex: "ASC"
      }
    });
  }
}
