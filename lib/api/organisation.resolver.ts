import { OrganisationsRepository } from "../storage/organisations.repository";
import { Inject, Service } from "typedi";
import { OrganisationGraphql } from "./organisation.graphql";
import { ParticipantsRepository } from "../storage/participants.repository";
import { ParticipantGraphql } from "./participant.graphql";
import { TokenGraphql } from "./token.graphql";
import { OrganisationsService } from "../services/organisations.service";

@Service()
export class OrganisationsResolver {
  constructor(
    @Inject(type => OrganisationsRepository) private readonly organisationsRepository: OrganisationsRepository,
    @Inject(type => ParticipantsRepository) private readonly participantsRepository: ParticipantsRepository,
    @Inject(type => OrganisationsService) private readonly organisationsService: OrganisationsService
  ) {}

  async organisation(address: string): Promise<Partial<OrganisationGraphql>> {
    return this.organisationsRepository.byAddress(address);
  }

  async participants(address: string): Promise<ParticipantGraphql[]> {
    const participants = await this.participantsRepository.allByOrganisationAddress(address);
    return participants.map(p => {
      return {
        address: p.participantAddress
      };
    });
  }

  async shares(address: string): Promise<TokenGraphql> {
    const shares = await this.organisationsService.shares(address);
    return {
      name: shares.name,
      amount: shares.totalSupply,
      decimals: shares.decimals
    };
  }
}
