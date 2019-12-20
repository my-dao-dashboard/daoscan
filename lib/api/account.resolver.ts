import { Inject, Service } from "typedi";
import { AccountGraphql } from "./account.graphql";
import { bind } from "decko";
import { ParticipantsRepository } from "../storage/participants.repository";
import { OrganisationResolver } from "./organisation.resolver";
import { OrganisationGraphql } from "./organisation.graphql";
import { EthereumService } from "../ethereum.service";

@Service()
export class AccountResolver {
  constructor(
    @Inject(type => ParticipantsRepository) private readonly participantsRepository: ParticipantsRepository,
    @Inject(type => OrganisationResolver) private readonly organisationResolver: OrganisationResolver,
    @Inject(type => EthereumService) private readonly ethereum: EthereumService
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
