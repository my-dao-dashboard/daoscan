import { Inject, Service } from "typedi";
import { EthereumService } from "../services/ethereum.service";
import { Contract } from "web3-eth-contract";
import { KNOWN_TOKENS } from "./known-tokens";
import { Token } from "../domain/token";

@Service(BalanceService.name)
export class BalanceService {
  constructor(@Inject(EthereumService.name) private readonly ethereum: EthereumService) {}

  get tokenContracts(): Contract[] {
    return KNOWN_TOKENS.map(t => {
      return this.ethereum.contract(t.abi, t.address);
    });
  }

  async ethBalance(address: string): Promise<Token> {
    const ethBalance = await this.ethereum.balance(address);
    return new Token({
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      amount: ethBalance
    });
  }

  async balanceOf(address: string, contract: Contract): Promise<Token> {
    const contractAddress = contract.options.address;
    const knownItem = KNOWN_TOKENS.find(k => k.address.toLowerCase() === contractAddress.toLowerCase());
    const name = knownItem ? knownItem.name : this.ethereum.codec.decodeString(await contract.methods.name().call());
    const symbol = knownItem
      ? knownItem.name
      : this.ethereum.codec.decodeString(await contract.methods.symbol().call());
    const amount = await contract.methods.balanceOf(address).call();
    const decimals = await contract.methods.decimals().call();
    return new Token({
      name: name,
      symbol: symbol,
      decimals: Number(decimals),
      amount: amount
    });
  }

  async tokenBalances(address: string): Promise<Token[]> {
    const promisedBalance = this.tokenContracts.map<Promise<Token>>(async contract => {
      return this.balanceOf(address, contract);
    });
    return Promise.all(promisedBalance);
  }
}
