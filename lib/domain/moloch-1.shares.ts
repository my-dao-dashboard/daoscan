import { ApplicationRepository } from "../storage/application.repository";
import { AbiItem } from "web3-utils";
import { EthereumService } from "../services/ethereum.service";
import { Contract } from "web3-eth-contract";
import { MOLOCH_1_ABI } from "../scraping/moloch-1/moloch-1.abi";

export class Moloch1Shares {
  constructor(
    private readonly organisationAddress: string,
    private readonly organisationName: string,
    private readonly applicationRepository: ApplicationRepository,
    private readonly ethereum: EthereumService
  ) {}

  tokenAddress(): Promise<string | undefined> {
    return this.applicationRepository.tokenAddress(this.organisationAddress);
  }

  async tokenContract(): Promise<Contract> {
    const tokenAddress = await this.tokenAddress();
    return this.ethereum.contract(MOLOCH_1_ABI as AbiItem[], tokenAddress);
  }

  async decimals(): Promise<number> {
    return 0;
  }

  async amount(): Promise<string> {
    const token = await this.tokenContract();
    try {
      return await token.methods.totalShares().call();
    } catch (e) {
      return "0";
    }
  }

  async symbol(): Promise<string | undefined> {
    return this.organisationName;
  }

  async name(): Promise<string | undefined> {
    return this.organisationName;
  }
}
