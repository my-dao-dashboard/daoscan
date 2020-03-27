import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Proposal } from "./proposal.row";
import { Repository, SelectQueryBuilder } from "typeorm";

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

  before(index: number, include: boolean) {
    const cmp = include ? ">=" : ">";
    const next = this.query.clone().andWhere(`${this.alias}.index ${cmp} :index`, {
      index: index
    });
    return new OrganisationConnectionQuery(next);
  }

  after(index: number, include: boolean) {
    const cmp = include ? "<=" : "<";
    const next = this.query.clone().andWhere(`${this.alias}.index ${cmp} :index`, {
      index: index
    });
    return new OrganisationConnectionQuery(next);
  }

  skip(n: number) {
    const next = this.query.clone().skip(n);
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

  async last(organisationAddress: string, n: number, beforeCursor: { index: number }) {
    const repository = await this.repositoryFactory.reading(Proposal);
    const query = OrganisationConnectionQuery.build(repository, organisationAddress);
    const totalCount = await query.getCount();
    const before = query.before(beforeCursor.index, false);

    const beforeCount = await before.getCount();
    const offset = beforeCount - n > 0 ? beforeCount - n : 0;

    const entries = await before
      .skip(offset)
      .take(n)
      .getMany();

    const startIndex = beforeCount - n + 1;
    const endIndex = startIndex + n - 1;
    const afterCount = totalCount - offset - n;

    return {
      startIndex: startIndex,
      endIndex: endIndex,
      hasPreviousPage: offset > 0,
      hasNextPage: afterCount > 0,
      entries: entries
    };
  }

  async first(organisationAddress: string, n: number, afterCursor?: { index: number }) {
    const repository = await this.repositoryFactory.reading(Proposal);
    let query = OrganisationConnectionQuery.build(repository, organisationAddress);
    const totalCount = await query.getCount();
    if (afterCursor?.index) {
      query = query.after(afterCursor.index, false);
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

  async save(proposal: Proposal) {
    const repository = await this.repositoryFactory.writing(Proposal);
    return repository.save(proposal);
  }
}
