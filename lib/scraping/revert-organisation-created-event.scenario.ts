import { Scenario } from "../shared/scenario.interface";
import { Inject, Service } from "typedi";
import { OrganisationCreatedEventRowRepository } from "../rel-storage/organisation-created-event-row.repository";

@Service(RevertOrganisationCreatedEventScenario.name)
export class RevertOrganisationCreatedEventScenario implements Scenario<number, number> {
  constructor(
    @Inject(OrganisationCreatedEventRowRepository.name)
    private readonly organisationCreatedEvents: OrganisationCreatedEventRowRepository
  ) {}

  async execute(blockId: number): Promise<number> {
    return 0
  }
}
