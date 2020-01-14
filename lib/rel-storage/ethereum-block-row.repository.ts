import { Inject, Service } from "typedi";
import { EthereumBlockRow } from "./ethereum-block-row.entity";
import { RepositoryFactory } from "./repository-factory";

@Service(EthereumBlockRowRepository.name)
export class EthereumBlockRowRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byId(id: number): Promise<EthereumBlockRow | undefined> {
    const repository = await this.repositoryFactory.reading(EthereumBlockRow);
    return repository.findOne({ id });
  }

  async isPresent(id: number): Promise<boolean> {
    const found = await this.byId(id)
    return Boolean(found)
  }

  async markParsed(id: number, hash: string): Promise<void> {
    const block = new EthereumBlockRow();
    block.id = id;
    block.hash = hash;
    await this.save(block);
  }

  async save(block: EthereumBlockRow) {
    const repository = await this.repositoryFactory.writing(EthereumBlockRow);
    return repository.save(block);
  }
}
