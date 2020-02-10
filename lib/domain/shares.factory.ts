import { Inject, Service } from "typedi";
import { Organisation } from "./organisation";
import { PLATFORM } from "./platform";
import { ApplicationRepository } from "../storage/application.repository";
import ERC20_TOKEN_ABI from "../querying/erc20-token.abi.json";
import { AbiItem } from "web3-utils";
import { EthereumService } from "../services/ethereum.service";
import { Shares } from "./shares";
import { InternalServerError } from "../shared/errors";
import { MOLOCH_1_ABI } from "../scraping/moloch-1/moloch-1.abi";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { MessariService } from "../querying/messari.service";

@Service(SharesFactory.name)
export class SharesFactory {
  constructor(
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository,
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(MessariService.name) private readonly messari: MessariService
  ) {}

  async forOrganisation(organisation: Organisation): Promise<Shares | undefined> {
    switch (organisation.platform) {
      case PLATFORM.ARAGON:
        return this.forAragon(organisation);
      case PLATFORM.MOLOCH_1:
        return this.forMoloch1(organisation);
      default:
        throw new UnreachableCaseError(organisation.platform);
    }
  }

  async forMoloch1(organisation: Organisation): Promise<Shares | undefined> {
    if (organisation.platform !== PLATFORM.MOLOCH_1)
      throw new InternalServerError(`Organisation ${organisation} has to be on ${PLATFORM.MOLOCH_1}`);

    const tokenAddress = await this.applicationRepository.tokenAddress(organisation.address);
    if (tokenAddress) {
      const token = this.ethereum.contract(MOLOCH_1_ABI as AbiItem[], tokenAddress);
      const amount = await token.methods.totalShares().call();
      const symbol = organisation.name;
      const name = organisation.name;
      const decimals = 0;
      const bank = await organisation.bank();
      return new Shares(decimals, amount, symbol, name, token, bank, this.messari);
    }
  }

  async forAragon(organisation: Organisation): Promise<Shares | undefined> {
    if (organisation.platform !== PLATFORM.ARAGON)
      throw new InternalServerError(`Organisation ${organisation} has to be on ${PLATFORM.ARAGON}`);

    const tokenAddress = await this.applicationRepository.tokenAddress(organisation.address);
    if (tokenAddress) {
      const token = this.ethereum.contract(ERC20_TOKEN_ABI as AbiItem[], tokenAddress);
      const decimalsRaw = await token.methods.decimals().call();
      const amount = await token.methods.totalSupply().call();
      const symbol = await token.methods.symbol().call();
      const name = await token.methods.name().call();
      const bank = await organisation.bank();
      return new Shares(Number(decimalsRaw), amount, symbol, name, token, bank, this.messari);
    }
  }
}
