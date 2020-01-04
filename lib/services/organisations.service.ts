import { Inject, Service } from "typedi";
import { OrganisationsRepository } from "../storage/organisations.repository";
import { ApplicationsRepository } from "../storage/applications.repository";
import { TOKEN_ABI } from "../scraping/aragon.constants";
import { EthereumService } from "../ethereum.service";
import Web3 from "web3";
import { BalanceService } from "./balance.service";
import { TokenGraphql } from "../api/token.graphql";
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
    @Inject(MessariService.name) private readonly messariService: MessariService
  ) {
    this.web3 = ethereumService.web3;
  }

  async priceOfShareUsd(totalSupply: TokenGraphql, bank: TokenGraphql[]): Promise<number> {
    const perTokenPromised = bank.map(async token => {
      const usdPrice = await this.messariService.usdPrice(token.symbol);
      const realAmount = new BigNumber(token.amount).div(10 ** token.decimals).toNumber();
      return usdPrice * realAmount;
    });
    const perToken = await Promise.all<number>(perTokenPromised);
    const totalUsd = perToken.reduce((acc, n) => acc + n, 0);
    const sharesNumber = new BigNumber(totalSupply.amount).div(10 ** totalSupply.decimals);
    return new BigNumber(totalUsd).div(sharesNumber).toNumber();
  }

  async shareValue(organisationAddress: string, symbol: string): Promise<TokenGraphql> {
    const totalSupply = await this.totalSupply(organisationAddress);
    const bank = await this.bank(organisationAddress);
    const usdAmount = await this.priceOfShareUsd(totalSupply, bank);
    const assetPrice = await this.messariService.usdPrice(symbol);
    const assetAmount = usdAmount / assetPrice;
    return {
      name: symbol,
      symbol: symbol,
      amount: (assetAmount * 10 ** 4).toFixed(0),
      decimals: 4
    };
  }

  async tokenContract(organisationAddress: string) {
    const tokenAddress = await this.applicationsRepository.tokenAddress(organisationAddress);
    return new this.web3.eth.Contract(TOKEN_ABI, tokenAddress);
  }

  async totalSupply(
    organisationAddress: string
  ): Promise<{ amount: string; decimals: number; name: string; symbol: string }> {
    const token = await this.tokenContract(organisationAddress);
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
