import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { BlockRecord } from "./block.record";

@Service(BlockRepository.name)
export class BlockRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async latest() {
    const repository = await this.repositoryFactory.reading(BlockRecord);
    const raw = await repository
      .createQueryBuilder("block")
      .select(`MAX(id)`, "max")
      .getRawOne();
    return Number(raw.max);
  }

  async isPresent(id: bigint) {
    const found = await this.byId(id);
    return Boolean(found);
  }

  async byId(id: bigint): Promise<BlockRecord | undefined> {
    const repository = await this.repositoryFactory.reading(BlockRecord);
    return repository.findOne({ id });
  }

  async allByIds(ids: bigint[]): Promise<BlockRecord[]> {
    const repository = await this.repositoryFactory.reading(BlockRecord);
    return repository.findByIds(ids);
  }

  async save(row: BlockRecord) {
    const repository = await this.repositoryFactory.writing(BlockRecord);
    await repository.save(row);
  }
}
