import { OrganisationsRepository } from "../storage/organisations.repository";
import { Inject, Service } from "typedi";
import { OrganisationGraphql } from "./organisation.graphql";
import { ParticipantsRepository } from "../storage/participants.repository";
import { ParticipantGraphql } from "./participant.graphql";
import { TokenGraphql } from "./token.graphql";
import { OrganisationsService } from "../services/organisations.service";
import { bind } from "decko";
import { BalanceService } from "../services/balance.service";

@Service()
export class OrganisationsResolver {
  constructor(
    @Inject(type => OrganisationsRepository) private readonly organisationsRepository: OrganisationsRepository,
    @Inject(type => ParticipantsRepository) private readonly participantsRepository: ParticipantsRepository,
    @Inject(type => OrganisationsService) private readonly organisationsService: OrganisationsService,
    @Inject(type => BalanceService) private readonly balanceService: BalanceService
  ) {}

  async organisation(address: string): Promise<Partial<OrganisationGraphql>> {
    return this.organisationsRepository.byAddress(address);
  }

  @bind()
  async participants(root: OrganisationGraphql): Promise<ParticipantGraphql[]> {
    const token = await this.organisationsService.tokenContract(root.address);
    const participants = await this.participantsRepository.allByOrganisationAddress(root.address);
    const promised = participants.map(async p => {
      const shares = await this.balanceService.balanceOf(p.participantAddress, token);
      return {
        address: p.participantAddress,
        shares
      };
    });
    return await Promise.all(promised);
  }

  @bind()
  async participant(root: OrganisationGraphql, args: { address: string }): Promise<ParticipantGraphql | null> {
    const organisationAddress = root.address;
    const participantAddress = args.address;
    const token = await this.organisationsService.tokenContract(organisationAddress);
    const participant = await this.participantsRepository.byAddressInOrganisation(
      organisationAddress,
      participantAddress
    );
    if (participant) {
      const shares = await this.balanceService.balanceOf(participantAddress, token);
      return {
        address: participantAddress,
        shares
      }
    } else {
      return null
    }
  }

  @bind()
  async totalSupply(root: OrganisationGraphql): Promise<TokenGraphql> {
    return this.organisationsService.totalSupply(root.address);
  }

  @bind()
  async shareValue(root: OrganisationGraphql, args: { symbol: string }): Promise<TokenGraphql> {
    return this.organisationsService.shareValue(root.address, args.symbol);
  }

  @bind()
  async bank(root: OrganisationGraphql) {
    return this.organisationsService.bank(root.address);
  }
}
