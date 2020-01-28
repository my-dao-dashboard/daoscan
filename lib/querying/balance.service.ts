import { Inject, Service } from "typedi";
import { EthereumService } from "../services/ethereum.service";
import { Contract } from "web3-eth-contract";
import { KNOWN_TOKENS } from "./known-tokens";
import { TokenPresentation } from "./token.presentation";

@Service(BalanceService.name)
export class BalanceService {
  constructor(@Inject(EthereumService.name) private readonly ethereum: EthereumService) {}

  get tokenContracts(): Contract[] {
    return KNOWN_TOKENS.map(t => {
      return this.ethereum.contract(t.abi, t.address);
    });
  }

  async ethBalance(address: string): Promise<TokenPresentation> {
    const ethBalance = await this.ethereum.balance(address);
    return new TokenPresentation("ETH", "ETH", ethBalance, 18);
  }

  async balanceOf(address: string, contract: Contract): Promise<TokenPresentation> {
    const contractAddress = contract.options.address;
    const knownItem = KNOWN_TOKENS.find(k => k.address.toLowerCase() === contractAddress.toLowerCase());
    const name = knownItem ? knownItem.name : this.ethereum.codec.decodeString(await contract.methods.name().call());
    const symbol = this.ethereum.codec.decodeString(await contract.methods.symbol().call());
    const amount = await contract.methods.balanceOf(address).call();
    const decimals = await contract.methods.decimals().call();
    return new TokenPresentation(name, symbol, amount, Number(decimals));
  }

  async tokenBalances(address: string): Promise<TokenPresentation[]> {
    const promisedBalance = this.tokenContracts.map<Promise<TokenPresentation>>(async contract => {
      return this.balanceOf(address, contract);
    });
    return Promise.all(promisedBalance);
  }
}
