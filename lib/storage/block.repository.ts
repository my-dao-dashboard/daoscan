import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Block } from "./block.row";

@Service(BlockRepository.name)
export class BlockRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async allByIds(ids: number[]): Promise<Block[]> {
    const repository = await this.repositoryFactory.reading(Block);
    return repository.findByIds(ids);
  }
}
