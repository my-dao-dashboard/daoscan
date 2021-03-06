import { Inject, Service } from "typedi";
import { Organisation } from "./organisation";
import { EthereumService } from "../services/ethereum.service";
import { OrganisationRepository } from "../storage/organisation.repository";
import { ScrapingEventFactory } from "../scraping/events/scraping-event.factory";
import { OrganisationService } from "./organisation.service";

@Service(OrganisationFactory.name)
export class OrganisationFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(ScrapingEventFactory.name) private readonly scrapingEventFactory: ScrapingEventFactory,
    @Inject(OrganisationService.name) private readonly organisationService: OrganisationService
  ) {}

  async byAddress(address: string): Promise<Organisation | undefined> {
    const organisationAddress = await this.ethereum.canonicalAddress(address);
    if (!organisationAddress) return undefined;
    const organisationRow = await this.organisationRepository.byAddress(organisationAddress);
    if (!organisationRow) return undefined;
    return new Organisation(organisationRow, this.organisationService);
  }
}
