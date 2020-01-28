import { Inject, Service } from "typedi";
import { bind } from "decko";
import { OrganisationRepository } from "../storage/organisation.repository";
import { MembershipRepository } from "../storage/membership.repository";

interface GlobalStats {
  organisationsCount: number;
  participantsCount: number;
}

@Service(GlobalStatsResolver.name)
export class GlobalStatsResolver {
  constructor(
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository
  ) {}

  @bind()
  async globalStats(): Promise<GlobalStats> {
    const organisationsCount = await this.organisationRepository.count();
    const participantsCount = await this.membershipRepository.participantsCount();
    console.log("pcount", participantsCount);
    return {
      organisationsCount: organisationsCount,
      participantsCount: 0
    };
  }
}