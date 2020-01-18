import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Block } from "./block.row";

@Service(BlockRepository.name)
export class BlockRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async isPresent(id: number) {
    const found = await this.byId(id);
    return Boolean(found);
  }

  async byId(id: number): Promise<Block | undefined> {
    const repository = await this.repositoryFactory.reading(Block);
    return repository.findOne({ id });
  }

  async allByIds(ids: number[]): Promise<Block[]> {
    const repository = await this.repositoryFactory.reading(Block);
    return repository.findByIds(ids);
  }
}
