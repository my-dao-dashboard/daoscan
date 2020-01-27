import { Inject, Service } from "typedi";
import { AccountPresentation } from "./account.presentation";
import { bind } from "decko";
import { EthereumService } from "../services/ethereum.service";
import { OrganisationPresentation } from "./organisation.presentation";
import { MembershipRepository } from "../storage/membership.repository";

// @Inject(OrganisationResolver.name) private readonly organisationResolver: OrganisationResolver,

@Service(AccountResolver.name)
export class AccountResolver {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository
  ) {}

  @bind()
  async organisations(root: AccountPresentation): Promise<Partial<OrganisationPresentation>[]> {
    const participantAddress = await this.ethereum.canonicalAddress(root.address);
    const participantEntities = await this.membershipRepository.allOrganisationAddresses(participantAddress);
    return [];
    // const organisationAddresses = participantEntities.map(p => p.organisationAddress);
    // const organisationsPromised = organisationAddresses.map(address => {
    //   return this.organisationResolver.organisation(address);
    // });
    // return Promise.all(organisationsPromised);
  }
}
