import { Inject, Service } from "typedi";
import { OrganisationStorage } from "../storage/organisation.storage";
import { EthereumService } from "../services/ethereum.service";
import { Organisation } from "./organisation";
import { OrganisationFactory } from "./organisation.factory";

@Service(OrganisationRepository.name)
export class OrganisationRepository {
  constructor(
    @Inject(OrganisationStorage.name) private readonly organisationStorage: OrganisationStorage,
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(OrganisationFactory.name) private readonly organisationFactory: OrganisationFactory
  ) {}

  async byAddress(address: string): Promise<Organisation | undefined> {
    const organisationAddress = await this.ethereum.canonicalAddress(address);
    if (!organisationAddress) return undefined;
    const record = await this.organisationStorage.byAddress(organisationAddress);
    if (!record) return undefined;
    return this.organisationFactory.fromRecord(record);
  }
}
