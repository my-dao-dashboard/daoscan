import { Inject, Service } from "typedi";
import BigNumber from "bignumber.js";
import { AbiItem } from "web3-utils";
import { OrganisationRepository } from "../storage/organisation.repository";
import { ApplicationRepository } from "../storage/application.repository";
import { EthereumService } from "../services/ethereum.service";
import { BalanceService } from "./balance.service";
import { MessariService } from "./messari.service";
import { TokenPresentation } from "./token.presentation";
import ERC20_TOKEN_ABI from "./erc20-token.abi.json";

@Service(OrganisationService.name)
export class OrganisationService {
  constructor(
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository,
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(BalanceService.name) private readonly balance: BalanceService,
    @Inject(MessariService.name) private readonly messari: MessariService
  ) {}

  async shareValueUsd(totalSupply: TokenPresentation, bank: TokenPresentation[]): Promise<number> {
    const perTokenPromised = bank.map(async token => {
      const usdPrice = await this.messari.usdPrice(token.symbol);
      const realAmount = new BigNumber(token.amount).div(10 ** token.decimals).toNumber();
      return usdPrice * realAmount;
    });
    const perToken = await Promise.all<number>(perTokenPromised);
    const totalUsd = perToken.reduce((acc, n) => acc + n, 0);
    const sharesNumber = new BigNumber(totalSupply.amount).div(10 ** totalSupply.decimals);
    return new BigNumber(totalUsd).div(sharesNumber).toNumber();
  }

  async shareValue(organisationAddress: string, symbol: string): Promise<TokenPresentation> {
    const totalSupply = await this.totalSupply(organisationAddress);
    const bank = await this.bank(organisationAddress);
    const usdAmount = await this.shareValueUsd(totalSupply, bank);
    const assetPrice = await this.messari.usdPrice(symbol);
    const assetAmount = usdAmount / assetPrice;
    const amount = (assetAmount * 10 ** 4).toFixed(0);
    return new TokenPresentation(symbol, symbol, amount, 4);
  }

  async tokenContract(organisationAddress: string) {
    const tokenAddress = await this.applicationRepository.tokenAddress(organisationAddress);
    return this.ethereum.contract(ERC20_TOKEN_ABI as AbiItem[], tokenAddress);
  }

  async totalSupply(organisationAddress: string): Promise<TokenPresentation> {
    const token = await this.tokenContract(organisationAddress);
    const name = await token.methods.name().call();
    const symbol = await token.methods.symbol().call();
    const decimals = await token.methods.decimals().call();
    const amount = await token.methods.totalSupply().call();
    return new TokenPresentation(name, symbol, amount, Number(decimals));
  }

  async bank(organisationAddress: string): Promise<TokenPresentation[]> {
    const bankAddress = await this.applicationRepository.bankAddress(organisationAddress);
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
