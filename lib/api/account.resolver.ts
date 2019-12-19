import { Inject, Service } from "typedi";
import { AccountGraphql } from "./account.graphql";
import { bind } from "decko";
import { ParticipantsRepository } from "../storage/participants.repository";
import { OrganisationResolver } from "./organisation.resolver";
import { OrganisationGraphql } from "./organisation.graphql";

@Service()
export class AccountResolver {
  constructor(
    @Inject(type => ParticipantsRepository) private readonly participantsRepository: ParticipantsRepository,
    @Inject(type => OrganisationResolver) private readonly organisationResolver: OrganisationResolver
  ) {}

  @bind()
  async organisations(root: AccountGraphql): Promise<Partial<OrganisationGraphql>[]> {
    const participantAddress = root.address;
    const participantEntities = await this.participantsRepository.allOrganisations(participantAddress);
    const organisationAddresses = participantEntities.map(p => p.organisationAddress);
    const organisationsPromised = organisationAddresses.map(address => {
      return this.organisationResolver.organisation(address);
    });
    return Promise.all(organisationsPromised);
  }
}
