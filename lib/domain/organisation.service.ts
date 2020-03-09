import { Inject, Service } from "typedi";
import { SharesFactory } from "./shares.factory";
import { ApplicationRepository } from "../storage/application.repository";
import { PLATFORM } from "./platform";
import { APP_ID } from "../storage/applications.const";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { BalanceService } from "../querying/balance.service";
import { Shares } from "./shares";
import { MembershipRepository } from "../storage/membership.repository";
import { Participant } from "./participant";
import { Organisation } from "./organisation";
import { Token } from "./token";

@Service(OrganisationService.name)
export class OrganisationService {
  constructor(
    @Inject(SharesFactory.name) private readonly sharesFactory: SharesFactory,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository,
    @Inject(BalanceService.name) private readonly balance: BalanceService,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository
  ) {}

  async shares(platform: PLATFORM, organisationAddress: string, name: string): Promise<Shares | undefined> {
    const bank = await this.bank(platform, organisationAddress);
    return this.sharesFactory.build(platform, organisationAddress, name, bank);
  }

  bankAddress(platform: PLATFORM, organisationAddress: string): Promise<string | undefined> {
    switch (platform) {
      case PLATFORM.MOLOCH_1:
        return this.applicationRepository.byOrganisationAndAppId(organisationAddress, APP_ID.MOLOCH_1_BANK);
      case PLATFORM.ARAGON:
        return this.applicationRepository.byOrganisationAndAppId(organisationAddress, APP_ID.ARAGON_VAULT);
      default:
        throw new UnreachableCaseError(platform);
    }
  }

  async bank(platform: PLATFORM, organisationAddress: string): Promise<Token[]> {
    const bankAddress = await this.bankAddress(platform, organisationAddress);
    if (bankAddress) {
      const ethBalance = await this.balance.ethBalance(bankAddress);
      const tokenBalances = await this.balance.tokenBalances(bankAddress);
      const balances = tokenBalances.concat(ethBalance);
      return balances.filter(b => b.amount != "0");
    } else {
      return [];
    }
  }

  async participant(organisation: Organisation, participantAddress: string) {
    const raw = await this.membershipRepository.byAddressInOrganisation(organisation.address, participantAddress);
    if (raw) {
      return new Participant(raw.accountAddress, organisation);
    } else {
      return undefined;
    }
  }

  async applications(organisation: Organisation) {
    return this.applicationRepository.allByOrganisationAddress(organisation.address);
  }
}
