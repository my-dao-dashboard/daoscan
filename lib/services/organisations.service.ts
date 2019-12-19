import { Inject, Service } from "typedi";
import { OrganisationsRepository } from "../storage/organisations.repository";
import { ApplicationsRepository } from "../storage/applications.repository";
import { TOKEN_ABI } from "../scraping/aragon.constants";
import { EthereumService } from "../ethereum.service";
import Web3 from "web3";
import { BalanceService } from "./balance.service";
import { TokenGraphql } from "../api/token.graphql";

@Service()
export class OrganisationsService {
  private readonly web3: Web3;
  constructor(
    @Inject(type => OrganisationsRepository) private readonly organisationsRepository: OrganisationsRepository,
    @Inject(type => ApplicationsRepository) private readonly applicationsRepository: ApplicationsRepository,
    @Inject(type => EthereumService) private readonly ethereumService: EthereumService,
    @Inject(type => BalanceService) private readonly balanceService: BalanceService
  ) {
    this.web3 = ethereumService.web3;
  }

  async shares(organisationAddress: string): Promise<{ totalSupply: string; decimals: number; name: string }> {
    const tokenAddress = await this.applicationsRepository.tokenAddress(organisationAddress);
    const token = new this.web3.eth.Contract(TOKEN_ABI, tokenAddress);
    const name = await token.methods.name().call();
    const decimals = await token.methods.decimals().call();
    const totalSupply = await token.methods.totalSupply().call();
    return {
      name,
      decimals: Number(decimals),
      totalSupply
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
