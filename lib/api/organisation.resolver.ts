import { OrganisationsRepository } from "../storage/organisations.repository";
import { Inject, Service } from "typedi";
import { OrganisationGraphql } from "./organisation.graphql";
import { ParticipantsRepository } from "../storage/participants.repository";
import { ParticipantGraphql } from "./participant.graphql";
import { TokenGraphql } from "./token.graphql";
import { OrganisationsService } from "../services/organisations.service";
import { bind } from "decko";
import { BalanceService } from "../services/balance.service";
import { EthereumService } from "../services/ethereum.service";

@Service(OrganisationResolver.name)
export class OrganisationResolver {
  constructor(
    @Inject(OrganisationsRepository.name) private readonly organisationsRepository: OrganisationsRepository,
    @Inject(ParticipantsRepository.name) private readonly participantsRepository: ParticipantsRepository,
    @Inject(OrganisationsService.name) private readonly organisationsService: OrganisationsService,
    @Inject(BalanceService.name) private readonly balanceService: BalanceService,
    @Inject(EthereumService.name) private readonly ethereum: EthereumService
  ) {}

  async organisation(address: string): Promise<Partial<OrganisationGraphql>> {
    const organisationAddress = await this.ethereum.canonicalAddress(address);
    return this.organisationsRepository.byAddress(organisationAddress);
  }

  @bind()
  async participants(root: OrganisationGraphql): Promise<ParticipantGraphql[]> {
    const organisationAddress = await this.ethereum.canonicalAddress(root.address);
    const token = await this.organisationsService.tokenContract(organisationAddress);
    const participants = await this.participantsRepository.allByOrganisationAddress(organisationAddress);
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
    const organisationAddress = await this.ethereum.canonicalAddress(root.address);
    const participantAddress = await this.ethereum.canonicalAddress(args.address);
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
      };
    } else {
      return null;
    }
  }

  @bind()
  async totalSupply(root: OrganisationGraphql): Promise<TokenGraphql> {
    const organisationAddress = await this.ethereum.canonicalAddress(root.address);
    return this.organisationsService.totalSupply(organisationAddress);
  }

  @bind()
  async shareValue(root: OrganisationGraphql, args: { symbol: string }): Promise<TokenGraphql> {
    const organisationAddress = await this.ethereum.canonicalAddress(root.address);
    return this.organisationsService.shareValue(organisationAddress, args.symbol);
  }

  @bind()
  async bank(root: OrganisationGraphql) {
    const organisationAddress = await this.ethereum.canonicalAddress(root.address);
    return this.organisationsService.bank(organisationAddress);
  }
}
