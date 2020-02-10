import { OrganisationCreatedEvent } from "../scraping/events/organisation-created.event";
import { Organisation as OrganisationRow } from "../storage/organisation.row";
import { ApplicationRepository } from "../storage/application.repository";
import { EthereumService } from "../services/ethereum.service";
import { Shares } from "./shares";
import { PLATFORM } from "./platform";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { APP_ID } from "../storage/app-id";
import { BalanceService } from "../querying/balance.service";
import { SharesFactory } from "./shares.factory";
import { IToken } from "./token.interface";

export class Organisation {
  readonly address = this.row.address;
  readonly platform = this.row.platform;
  readonly name = this.row.name;
  readonly txid = this.event.txid;
  readonly timestamp = this.event.timestamp;
  readonly blockNumber = this.event.blockNumber;

  constructor(
    private readonly row: OrganisationRow,
    private readonly event: OrganisationCreatedEvent,
    private readonly applicationRepository: ApplicationRepository,
    private readonly ethereum: EthereumService,
    private readonly balance: BalanceService,
    private readonly sharesFactory: SharesFactory
  ) {}

  shares(): Promise<Shares | undefined> {
    return this.sharesFactory.forOrganisation(this);
  }

  bankAddress(): Promise<string | undefined> {
    switch (this.platform) {
      case PLATFORM.MOLOCH_1:
        return this.applicationRepository.byOrganisationAndAppId(this.address, APP_ID.MOLOCH_1_BANK);
      case PLATFORM.ARAGON:
        return this.applicationRepository.byOrganisationAndAppId(this.address, APP_ID.ARAGON_VAULT);
      default:
        throw new UnreachableCaseError(this.platform);
    }
  }

  async bank(): Promise<IToken[]> {
    const bankAddress = await this.bankAddress();
    if (bankAddress) {
      const ethBalance = await this.balance.ethBalance(bankAddress);
      const tokenBalances = await this.balance.tokenBalances(bankAddress);
      const balances = tokenBalances.concat(ethBalance);
      return balances.filter(b => b.amount != "0");
    } else {
      return [];
    }
  }
}
