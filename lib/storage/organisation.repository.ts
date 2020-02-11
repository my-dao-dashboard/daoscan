import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { Organisation } from "./organisation.row";
import { UUID } from "./uuid";
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
    return repository.find({ platform });
  }

  async byId(id: UUID): Promise<Organisation | undefined> {
    const repository = await this.repositoryFactory.reading(Organisation);
    return repository.findOne({ eventId: id });
  }
}
