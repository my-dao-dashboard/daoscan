import { Inject, Service } from "typedi";
import { OrganisationsRepository } from "../storage/organisations.repository";
import { ApplicationsRepository } from "../storage/applications.repository";
import { TOKEN_ABI } from "../scraping/aragon.constants";
import { EthereumService } from "../ethereum.service";
import Web3 from "web3";
import { BalanceService } from "./balance.service";
import { TokenGraphql } from "../api/token.graphql";
import { SharesGraphql } from "../api/shares.graphql";
import { MessariService } from "./messari.service";
import BigNumber from "bignumber.js";

@Service()
export class OrganisationsService {
  private readonly web3: Web3;
  constructor(
    @Inject(type => OrganisationsRepository) private readonly organisationsRepository: OrganisationsRepository,
    @Inject(type => ApplicationsRepository) private readonly applicationsRepository: ApplicationsRepository,
    @Inject(type => EthereumService) private readonly ethereumService: EthereumService,
    @Inject(type => BalanceService) private readonly balanceService: BalanceService,
    @Inject(type => MessariService) private readonly messariService: MessariService
  ) {
    this.web3 = ethereumService.web3;
  }

  async shares(organisationAddress: string): Promise<SharesGraphql> {
    const totalSupply = await this.totalSupply(organisationAddress);
    const bank = await this.bank(organisationAddress);
    const shareValue = await this.shareValue(totalSupply, bank);
    return {
      totalSupply,
      shareValue
    };
  }

  async priceOfShareUsd(shares: TokenGraphql, bank: TokenGraphql[]): Promise<number> {
    const perTokenPromised = bank.map(async token => {
      const usdPrice = await this.messariService.usdPrice(token.symbol);
      const realAmount = new BigNumber(token.amount).div(10 ** token.decimals).toNumber();
      return usdPrice * realAmount;
    });
    const perToken = await Promise.all<number>(perTokenPromised);
    const totalUsd = perToken.reduce((acc, n) => acc + n, 0);
    const sharesNumber = new BigNumber(shares.amount).div(10 ** shares.decimals);
    return new BigNumber(totalUsd).div(sharesNumber).toNumber();
  }

  async shareValue(shares: TokenGraphql, bank: TokenGraphql[]): Promise<TokenGraphql[]> {
    const usdAmount = await this.priceOfShareUsd(shares, bank);
    const ethPrice = await this.messariService.usdPrice("ETH");
    const ethAmount = ethPrice * usdAmount;
    return [
      {
        name: "USD",
        symbol: "USD",
        amount: (usdAmount * 100).toFixed(0),
        decimals: 2
      },
      {
        name: "ETH",
        symbol: "ETH",
        amount: new BigNumber(ethAmount).multipliedBy(new BigNumber(10 ** 18)).toString(10),
        decimals: 18
      }
    ];
  }

  async totalSupply(
    organisationAddress: string
  ): Promise<{ amount: string; decimals: number; name: string; symbol: string }> {
    const tokenAddress = await this.applicationsRepository.tokenAddress(organisationAddress);
    const token = new this.web3.eth.Contract(TOKEN_ABI, tokenAddress);
    const name = await token.methods.name().call();
    const symbol = await token.methods.symbol().call();
    const decimals = await token.methods.decimals().call();
    const amount = await token.methods.totalSupply().call();
    return {
      name,
      symbol,
      decimals: Number(decimals),
      amount
    };
  }

  async bank(organisationAddress: string): Promise<TokenGraphql[]> {
    const bankAddress = await this.applicationsRepository.bankAddress(organisationAddress);
    if (bankAddress) {
      const ethBalance = await this.balanceService.ethBalance(bankAddress);
      const tokenBalances = await this.balanceService.tokenBalances(bankAddress);
      const balances = tokenBalances.concat(ethBalance);
      return balances.filter(b => b.amount != "0");
    } else {
      return [];
    }
  }
}
