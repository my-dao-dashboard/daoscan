import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Proposal } from "./proposal.row";
import { LessThanOrEqual, Repository, SelectQueryBuilder } from "typeorm";
import { Organisation } from "./organisation.row";

class OrganisationConnectionQuery {
  private readonly alias = this.query.alias;

  constructor(readonly query: SelectQueryBuilder<Proposal>) {}

  static build(repository: Repository<Proposal>, organisationAddress: string) {
    const query = repository
      .createQueryBuilder("proposal")
      .orderBy({ "proposal.index": "DESC" })
      .where("proposal.organisationAddress = :organisationAddress", { organisationAddress: organisationAddress });
    return new OrganisationConnectionQuery(query);
  }

  after(index: number, include: boolean) {
    const cmp = include ? "<=" : "<";
    const next = this.query.clone().andWhere(`${this.alias}.index ${cmp} :index`, {
      index: index
    });
    return new OrganisationConnectionQuery(next);
  }

  take(n: number) {
    const next = this.query.clone().take(n);
    return new OrganisationConnectionQuery(next);
  }

  getCount() {
    return this.query.getCount();
  }

  getMany() {
    return this.query.getMany();
  }
}

@Service(ProposalRepository.name)
export class ProposalRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byOrganisationAndIndex(organisationAddress: string, index: number) {
    const repository = await this.repositoryFactory.reading(Proposal);
    return repository.findOne({
      organisationAddress,
      index
    });
  }

  async allByOrganisation(organisationAddress: string) {
    const repository = await this.repositoryFactory.reading(Proposal);
    return repository
      .createQueryBuilder("proposal")
      .where("proposal.organisationAddress = :organisationAddress", { organisationAddress: organisationAddress })
      .addOrderBy("proposal.index", "DESC")
      .getMany();
  }

  async countByOrganisation(organisationAddress: string): Promise<number> {
    const repository = await this.repositoryFactory.reading(Proposal);
    return repository
      .createQueryBuilder("proposal")
      .where("proposal.organisationAddress = :organisationAddress", { organisationAddress: organisationAddress })
      .getCount();
  }

  async first(organisationAddress: string, n: number, after?: { index: number }) {
    const repository = await this.repositoryFactory.reading(Proposal);
    let query = OrganisationConnectionQuery.build(repository, organisationAddress);
    const totalCount = await query.getCount();
    if (after?.index) {
      query = query.after(after.index, false);
    }
    const afterCount = await query.getCount();
    const entries = await query.take(n).getMany();
    const startIndex = totalCount - afterCount + 1;
    const endIndex = startIndex + entries.length - 1;
    return {
      startIndex: startIndex,
      endIndex: endIndex,
      hasNextPage: afterCount > n,
      hasPreviousPage: startIndex > 1,
      entries: entries
    };
  }
}
