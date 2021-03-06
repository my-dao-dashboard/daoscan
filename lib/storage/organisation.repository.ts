import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Organisation } from "./organisation.row";
import { PLATFORM } from "../domain/platform";

@Service(OrganisationRepository.name)
export class OrganisationRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byAddress(address: string) {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.findOne({
      address: address
    });
  }

  async count() {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.count();
  }

  async uniq() {
    const repository = await this.repositoryFactory.reading(Organisation);
    const raw = await repository
      .createQueryBuilder("organisation")
      .select('count(distinct ("address"))', "count")
      .getRawOne();
    return Number(raw.count);
  }

  async save(row: Organisation): Promise<void> {
    const repository = await this.repositoryFactory.writing(Organisation);
    await repository.save(row);
  }

  async all(platform: PLATFORM): Promise<Organisation[]> {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository
      .createQueryBuilder("organisation")
      .where({ platform })
      .addOrderBy("organisation.id", "DESC")
      .getMany();
  }

  async byId(id: bigint) {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.findOne({ id: id });
  }
}
