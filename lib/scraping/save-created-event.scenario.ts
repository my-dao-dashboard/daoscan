import { Scenario } from "../shared/scenario.interface";
import { OrganisationCreatedEvent } from "../shared/organisation-events";
import { Inject, Service } from "typedi";
import { OrganisationCreatedEventRowRepository } from "../rel-storage/organisation-created-event-row.repository";
import { OrganisationCreatedEventRow } from "../rel-storage/organisation-created-event.row";
import { OrganisationRow } from "../rel-storage/organisation.row";
import { OrganisationRowRepository } from "../rel-storage/organisation-row.repository";

@Service()
export class SaveCreatedEventScenario implements Scenario<OrganisationCreatedEvent, void> {
  constructor(
    @Inject(OrganisationCreatedEventRowRepository.name)
    private readonly eventsRepository: OrganisationCreatedEventRowRepository,
    @Inject(OrganisationRowRepository.name)
    private readonly organisationsRepository: OrganisationRowRepository
  ) {}

  async execute(event: OrganisationCreatedEvent): Promise<void> {
    const row = new OrganisationCreatedEventRow();
    row.address = event.address;
    row.blockId = event.blockNumber;
    row.name = event.name;
    row.platform = event.platform;
    row.txid = event.txid;
    await this.eventsRepository.save(row);

    const organisation = new OrganisationRow();
    organisation.address = event.address;
    organisation.name = event.name;
    organisation.platform = event.platform;
    await this.organisationsRepository.save(organisation);
  }
}
