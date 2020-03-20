import { Inject, Service } from "typedi";
import { bind } from "decko";
import { EthereumService } from "../services/ethereum.service";
import { MembershipRepository } from "../storage/membership.repository";
import { BalanceService } from "./balance.service";
import { Organisation } from "../domain/organisation";
import { OrganisationFactory } from "../domain/organisation.factory";
import { ProposalRepository } from "../storage/proposal.repository";
import { ProposalFactory } from "../domain/proposal.factory";
import { OrganisationService } from "../domain/organisation.service";
import { OrganisationParticipantConnection } from "./organisation-participant-connection";
import { Token } from "../domain/token";
import { Participant } from "../domain/participant";
import { IPagination } from "./pagination.interface";
import { OrganisationConnection } from "./organisation-connection";
import { OrganisationRepository } from "../storage/organisation.repository";
import { OrganisationProposalConnection } from "./organisation-proposal-connection";

@Service(OrganisationResolver.name)
export class OrganisationResolver {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository,
    @Inject(BalanceService.name) private readonly balance: BalanceService,
    @Inject(OrganisationFactory.name) private readonly organisationFactory: OrganisationFactory,
    @Inject(ProposalRepository.name) private readonly proposalRepository: ProposalRepository,
    @Inject(ProposalFactory.name) private readonly proposalFactory: ProposalFactory,
    @Inject(OrganisationService.name) private readonly organisationService: OrganisationService,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository
  ) {}

  @bind()
  async organisation(address: string): Promise<Organisation | undefined> {
    return this.organisationFactory.byAddress(address);
  }

  @bind()
  async organisations(pagination: IPagination) {
    return new OrganisationConnection(pagination, this.organisationRepository, this.organisationFactory);
  }

  @bind()
  async totalSupply(root: Organisation) {
    return root.shares();
  }

  @bind()
  async bank(root: Organisation): Promise<Token[]> {
    return root.bank();
  }

  @bind()
  async participant(root: Organisation, args: { address: string }): Promise<Participant | null> {
    const participantAddress = await this.ethereum.canonicalAddress(args.address);
    const participant = await this.membershipRepository.byAddressInOrganisation(root.address, participantAddress);
    if (participant) {
      return new Participant(participantAddress, root);
    } else {
      return null;
    }
  }

  @bind()
  async proposals(root: Organisation, args: { page?: IPagination }) {
    const page = args?.page || {};
    return new OrganisationProposalConnection(root, page, this.proposalRepository);
  }

  @bind()
  async proposal(root: Organisation, args: { index: number }) {
    const row = await this.proposalRepository.byOrganisationAndIndex(root.address, args.index);
    if (row) {
      return this.proposalFactory.fromRow(row);
    } else {
      return undefined;
    }
  }

  @bind()
  async participants(root: Organisation, args: { page?: IPagination }) {
    const page = args?.page || {};
    return new OrganisationParticipantConnection(root, page, this.membershipRepository);
  }

  @bind()
  async applications(root: Organisation) {
    return root.applications();
  }
}
