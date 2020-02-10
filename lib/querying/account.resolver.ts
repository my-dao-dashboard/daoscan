import { Inject, Service } from "typedi";
import { AccountPresentation } from "./account.presentation";
import { bind } from "decko";
import { EthereumService } from "../services/ethereum.service";
import { MembershipRepository } from "../storage/membership.repository";
import { OrganisationResolver } from "./organisation.resolver";
import _ from "lodash";
import { Organisation } from "../domain/organisation";

@Service(AccountResolver.name)
export class AccountResolver {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository,
    @Inject(OrganisationResolver.name) private readonly organisationResolver: OrganisationResolver
  ) {}

  @bind()
  async organisations(root: AccountPresentation): Promise<Partial<Organisation>[]> {
    const participantAddress = await this.ethereum.canonicalAddress(root.address);
    const organisationAddresses = await this.membershipRepository.allOrganisationAddresses(participantAddress);
    const promised = organisationAddresses.map(async address => {
      return this.organisationResolver.organisation(address);
    });
    const organisations = await Promise.all(promised);
    return _.compact(organisations);
  }
}
