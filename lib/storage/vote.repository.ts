import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { VoteRecord } from "./vote.record";
import { VOTE_DECISION } from "../domain/vote-decision";
import { Repository, SelectQueryBuilder } from "typeorm";

type Proposal = {
  organisationAddress: string;
  index: number;
};

type Cursor = {
  id: BigInt;
  createdAt: Date;
};

class ConnectionQuery {
  private readonly alias = this.query.alias;

  constructor(readonly query: SelectQueryBuilder<VoteRecord>) {}

  static build(repository: Repository<VoteRecord>, proposal: Proposal) {
    const query = repository
      .createQueryBuilder("vote")
      .where({
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress
      })
      .orderBy({
        "vote.createdAt": "DESC",
        "vote.id": "DESC"
      });
    return new ConnectionQuery(query);
  }

  before(cursor: Cursor, include: boolean) {
    const cmp = include ? ">=" : ">";
    const next = this.query
      .clone()
      .andWhere(`${this.alias}.createdAt >= :createdAt`, { createdAt: cursor.createdAt })
      .andWhere(`(${this.alias}.createdAt ${cmp} :createdAt OR ${this.alias}.id ${cmp} :id)`, {
        createdAt: cursor.createdAt,
        id: cursor.id.toString()
      });
    return new ConnectionQuery(next);
  }

  after(cursor: Cursor, include: boolean) {
    const cmp = include ? "<=" : "<";
    const next = this.query
      .clone()
      .andWhere(`${this.alias}.createdAt <= :createdAt`, { createdAt: cursor.createdAt })
      .andWhere(`(${this.alias}.createdAt ${cmp} :createdAt OR ${this.alias}.id ${cmp} :id)`, {
        createdAt: cursor.createdAt,
        id: cursor.id.toString()
      });
    return new ConnectionQuery(next);
  }

  skip(n: number) {
    const next = this.query.clone().skip(n);
    return new ConnectionQuery(next);
  }

  take(n: number) {
    const next = this.query.clone().take(n);
    return new ConnectionQuery(next);
  }

  getCount() {
    return this.query.getCount();
  }

  getMany() {
    return this.query.getMany();
  }
}

@Service(VoteRepository.name)
export class VoteRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async countByProposal(proposal: Proposal) {
    const repository = await this.repositoryFactory.reading(VoteRecord);
    return repository.count({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress
      }
    });
  }

  async countByProposalDecision(proposal: Proposal, decision: VOTE_DECISION) {
    const repository = await this.repositoryFactory.reading(VoteRecord);
    return repository.count({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress,
        decision: decision
      }
    });
  }

  async allByProposalDecision(proposal: Proposal, decision: VOTE_DECISION) {
    const repository = await this.repositoryFactory.reading(VoteRecord);
    return repository.find({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress,
        decision: decision
      },
      order: {
        createdAt: "DESC"
      }
    });
  }

  async allByProposal(proposal: Proposal): Promise<VoteRecord[]> {
    const repository = await this.repositoryFactory.reading(VoteRecord);
    return repository.find({
      where: {
        proposalIndex: proposal.index,
        organisationAddress: proposal.organisationAddress
      },
      order: {
        createdAt: "DESC"
      }
    });
  }

  async first(proposal: Proposal, take: number, cursor?: Cursor) {
    const repository = await this.repositoryFactory.reading(VoteRecord);
    let query = ConnectionQuery.build(repository, proposal);
    const totalCount = await query.getCount();
    if (cursor) {
      query = query.after(cursor, false);
    }
    const afterCount = await query.getCount();
    const entries = await query.take(take).getMany();
    const startIndex = totalCount - afterCount + 1;
    const endIndex = startIndex + entries.length - 1;
    return {
      startIndex: startIndex,
      endIndex: endIndex,
      hasNextPage: afterCount > take,
      hasPreviousPage: startIndex > 1,
      entries: entries
    };
  }

  async last(proposal: Proposal, take: number, cursor: Cursor) {
    const repository = await this.repositoryFactory.reading(VoteRecord);
    const query = ConnectionQuery.build(repository, proposal);
    const totalCount = await query.getCount();
    const before = query.before(cursor, false);

    const beforeCount = await before.getCount();
    const offset = beforeCount - take > 0 ? beforeCount - take : 0;

    const entries = await before
      .skip(offset)
      .take(take)
      .getMany();

    const startIndex = beforeCount - take + 1;
    const endIndex = startIndex + take - 1;
    const afterCount = totalCount - offset - take;

    return {
      startIndex: startIndex,
      endIndex: endIndex,
      hasPreviousPage: offset > 0,
      hasNextPage: afterCount > 0,
      entries: entries
    };
  }

  async toProcess(limit: number): Promise<VoteRecord[]> {
    const repository = await this.repositoryFactory.reading(VoteRecord);
    return repository
      .createQueryBuilder("p")
      .where("p.createdAt < '1980-01-01'")
      .take(limit)
      .getMany();
  }

  async save(vote: VoteRecord): Promise<VoteRecord> {
    const repository = await this.repositoryFactory.writing(VoteRecord);
    return repository.save(vote);
  }
}
