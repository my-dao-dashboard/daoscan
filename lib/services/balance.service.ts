import { Inject, Service } from "typedi";
import { EthereumService } from "./ethereum.service";
import Web3 from "web3";
import { TokenGraphql } from "../api/token.graphql";
import { Contract } from "web3-eth-contract";
import { decodeString } from "../shared/decode-string";
import { KNOWN_TOKENS } from "../const/known-tokens";

@Service(BalanceService.name)
export class BalanceService {
  private readonly web3: Web3;

  constructor(@Inject(EthereumService.name) private readonly ethereum: EthereumService) {
    this.web3 = ethereum.web3;
  }

  get tokenContracts(): Contract[] {
    return KNOWN_TOKENS.map(t => new this.web3.eth.Contract(t.abi, t.address));
  }

  async ethBalance(address: string): Promise<TokenGraphql> {
    const ethBalance = await this.web3.eth.getBalance(address);
    return {
      name: "ETH",
      symbol: "ETH",
      amount: ethBalance,
      decimals: 18
    };
  }

  async balanceOf(
    address: string,
    tokenContract: Contract
  ): Promise<{ symbol: string; amount: string; decimals: number; name: string }> {
    const name = decodeString(await tokenContract.methods.name().call());
    const symbol = decodeString(await tokenContract.methods.symbol().call());
    const amount = await tokenContract.methods.balanceOf(address).call();
    const decimals = await tokenContract.methods.decimals().call();
    return {
      amount,
      symbol,
      name,
      decimals: Number(decimals)
    };
  }

  async tokenBalances(address: string): Promise<TokenGraphql[]> {
    const promisedBalance = this.tokenContracts.map<Promise<TokenGraphql>>(async contract => {
      return this.balanceOf(address, contract);
    });
    return Promise.all(promisedBalance);
  }
}
