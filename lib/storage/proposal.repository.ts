import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Proposal } from "./proposal.row";

@Service(ProposalRepository.name)
export class ProposalRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async allByOrganisation(organisationAddress: string) {
    const repository = await this.repositoryFactory.reading(Proposal);
    return (
      repository
        .createQueryBuilder("proposal")
        .where("proposal.organisationAddress = :organisationAddress", { organisationAddress: organisationAddress })
        .addOrderBy("proposal.index", "ASC")
        .getMany()
    );
  }
}
