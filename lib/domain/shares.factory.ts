import { Inject, Service } from "typedi";
import { PLATFORM } from "./platform";
import { ApplicationRepository } from "../storage/application.repository";
import ERC20_TOKEN_ABI from "../querying/erc20-token.abi.json";
import { AbiItem } from "web3-utils";
import { EthereumService } from "../services/ethereum.service";
import { Shares } from "./shares";
import { MOLOCH_1_ABI } from "../scraping/moloch-1/moloch-1.abi";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { MessariService } from "../querying/messari.service";
import { IToken } from "./token.interface";

@Service(SharesFactory.name)
export class SharesFactory {
  constructor(
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository,
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(MessariService.name) private readonly messari: MessariService
  ) {}

  async build(platform: PLATFORM, address: string, name: string, bank: IToken[]): Promise<Shares | undefined> {
    switch (platform) {
      case PLATFORM.ARAGON:
        return this.forAragon(address, bank);
      case PLATFORM.MOLOCH_1:
        return this.forMoloch1(address, name, bank);
      default:
        throw new UnreachableCaseError(platform);
    }
  }

  async forMoloch1(address: string, name: string, bank: IToken[]): Promise<Shares | undefined> {
    const tokenAddress = await this.applicationRepository.tokenAddress(address);
    if (tokenAddress) {
      const token = this.ethereum.contract(MOLOCH_1_ABI as AbiItem[], tokenAddress);
      const amount = await token.methods.totalShares().call();
      const symbol = name;
      const decimals = 0;
      return new Shares(decimals, amount, symbol, name, token, PLATFORM.MOLOCH_1, bank, this.messari);
    }
  }

  async forAragon(address: string, bank: IToken[]): Promise<Shares | undefined> {
    const tokenAddress = await this.applicationRepository.tokenAddress(address);
    if (tokenAddress) {
      const token = this.ethereum.contract(ERC20_TOKEN_ABI as AbiItem[], tokenAddress);
      const decimalsRaw = await token.methods.decimals().call();
      const amount = await token.methods.totalSupply().call();
      const symbol = await token.methods.symbol().call();
      const name = await token.methods.name().call();
      return new Shares(Number(decimalsRaw), amount, symbol, name, token, PLATFORM.ARAGON, bank, this.messari);
    }
  }
}
