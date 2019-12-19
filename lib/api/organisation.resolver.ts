import { OrganisationsRepository } from "../storage/organisations.repository";
import { Inject, Service } from "typedi";
import { OrganisationGraphql } from "./organisation.graphql";
import { ParticipantsRepository } from "../storage/participants.repository";
import { ParticipantGraphql } from "./participant.graphql";
import { TokenGraphql } from "./token.graphql";
import { OrganisationsService } from "../services/organisations.service";
import { bind } from "decko";
import {SharesGraphql} from "./shares.graphql";

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

  @bind()
  async participants(root: OrganisationGraphql): Promise<ParticipantGraphql[]> {
    const participants = await this.participantsRepository.allByOrganisationAddress(root.address);
    return participants.map(p => {
      return {
        address: p.participantAddress
      };
    });
  }

  @bind()
  async shares(root: OrganisationGraphql): Promise<SharesGraphql> {
    const shares = await this.organisationsService.shares(root.address);
    return {
      totalSupply: shares.totalSupply,
      shareValue: shares.shareValue
    }
  }

  @bind()
  async bank(root: OrganisationGraphql) {
    return this.organisationsService.bank(root.address);
  }
}
