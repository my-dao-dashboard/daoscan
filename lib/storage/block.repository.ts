import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Block } from "./block.row";

const TODO_TEMP_BLOCK_HINGE = 8403326;

@Service(BlockRepository.name)
export class BlockRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async latest() {
    const repository = await this.repositoryFactory.reading(Block);
    const raw = await repository
      .createQueryBuilder("block")
      .select(`MAX(id)`, "max")
      .where(`block.id < :hinge`, { hinge: TODO_TEMP_BLOCK_HINGE })
      .getRawOne();
    return Number(raw.max);
  }

  async isPresent(id: bigint) {
    const found = await this.byId(id);
    return Boolean(found);
  }

  async byId(id: bigint): Promise<Block | undefined> {
    const repository = await this.repositoryFactory.reading(Block);
    return repository.findOne({ id });
  }

  async allByIds(ids: bigint[]): Promise<Block[]> {
    const repository = await this.repositoryFactory.reading(Block);
    return repository.findByIds(ids);
  }

  async save(row: Block) {
    const repository = await this.repositoryFactory.writing(Block);
    await repository.save(row);
  }
}
