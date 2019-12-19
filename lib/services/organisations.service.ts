import { Inject, Service } from "typedi";
import { OrganisationsRepository } from "../storage/organisations.repository";
import { ApplicationsRepository } from "../storage/applications.repository";
import { TOKEN_ABI, TOKEN_CONTROLLER_ABI } from "../scraping/aragon.constants";
import { EthereumService } from "../ethereum.service";
import Web3 from "web3";

@Service()
export class OrganisationsService {
  private readonly web3: Web3;
  constructor(
    @Inject(type => OrganisationsRepository) private readonly organisationsRepository: OrganisationsRepository,
    @Inject(type => ApplicationsRepository) private readonly applicationsRepository: ApplicationsRepository,
    @Inject(type => EthereumService) private readonly ethereumService: EthereumService
  ) {
    this.web3 = ethereumService.web3;
  }

  async shares(address: string): Promise<{ totalSupply: string; decimals: number; name: string }> {
    const tokenAddress = await this.applicationsRepository.tokenAddress(address);
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
}
