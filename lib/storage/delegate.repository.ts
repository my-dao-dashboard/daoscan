import { Inject, Service } from "typedi";
import { RepositoryFactory } from "./repository.factory";
import { UUID } from "./uuid";
import { Delegate } from "./delegate.row";

@Service(DelegateRepository.name)
export class DelegateRepository {
  constructor(@Inject(RepositoryFactory.name) private readonly repositoryFactory: RepositoryFactory) {}

  async byEventId(eventId: UUID): Promise<Delegate[]> {
    const repository = await this.repositoryFactory.reading(Delegate);
    return repository.find({
      eventId: eventId
    });
  }
}
