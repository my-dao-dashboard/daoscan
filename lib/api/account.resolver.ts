import { Inject, Service } from "typedi";
import { AccountGraphql } from "./account.graphql";
import { bind } from "decko";
import { ParticipantsRepository } from "../storage/participants.repository";
import { OrganisationResolver } from "./organisation.resolver";
import { OrganisationGraphql } from "./organisation.graphql";
import { EthereumService } from "../services/ethereum.service";

@Service(AccountResolver.name)
export class AccountResolver {
  constructor(
    @Inject(ParticipantsRepository.name) private readonly participantsRepository: ParticipantsRepository,
    @Inject(OrganisationResolver.name) private readonly organisationResolver: OrganisationResolver,
    @Inject(EthereumService.name) private readonly ethereum: EthereumService
  ) {}

  @bind()
  async organisations(root: AccountGraphql): Promise<Partial<OrganisationGraphql>[]> {
    const participantAddress = await this.ethereum.canonicalAddress(root.address);
    const participantEntities = await this.participantsRepository.allOrganisations(participantAddress);
    const organisationAddresses = participantEntities.map(p => p.organisationAddress);
    const organisationsPromised = organisationAddresses.map(address => {
      return this.organisationResolver.organisation(address);
    });
    return Promise.all(organisationsPromised);
  }
}
