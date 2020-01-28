import { Inject, Service } from "typedi";
import { bind } from "decko";
import { EthereumService } from "../services/ethereum.service";
import { OrganisationPresentation } from "./organisation.presentation";
import { OrganisationRepository } from "../storage/organisation.repository";
import { EventRepository } from "../storage/event.repository";
import { ScrapingEventFactory } from "../scraping/events/scraping-event.factory";
import { SCRAPING_EVENT_KIND } from "../scraping/events/scraping-event.kind";
import { TokenPresentation } from "./token.presentation";
import { OrganisationService } from "./organisation.service";

@Service(OrganisationResolver.name)
export class OrganisationResolver {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(ScrapingEventFactory.name) private readonly scrapingEventFactory: ScrapingEventFactory,
    @Inject(OrganisationService.name) private readonly organisationService: OrganisationService
  ) {}

  @bind()
  async organisation(address: string): Promise<OrganisationPresentation | undefined> {
    const organisationAddress = await this.ethereum.canonicalAddress(address);
    if (!organisationAddress) return undefined;
    const organisation = await this.organisationRepository.byAddress(organisationAddress);
    if (!organisation) return undefined;
    const event = await this.scrapingEventFactory.fromStorage(organisation.id);
    if (!event || event.kind !== SCRAPING_EVENT_KIND.ORGANISATION_CREATED) return undefined;
    return new OrganisationPresentation(organisation, event);
  }

  @bind()
  async totalSupply(root: OrganisationPresentation): Promise<TokenPresentation> {
    const organisationAddress = await this.ethereum.canonicalAddress(root.address);
    return this.organisationService.totalSupply(organisationAddress);
  }

  @bind()
  async bank(root: OrganisationPresentation) {
    const organisationAddress = await this.ethereum.canonicalAddress(root.address);
    return this.organisationService.bank(organisationAddress);
  }
}
