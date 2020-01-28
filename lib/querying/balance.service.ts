import { Inject, Service } from "typedi";
import { EthereumService } from "../services/ethereum.service";
import { Contract } from "web3-eth-contract";
import { KNOWN_TOKENS } from "./known-tokens";
import { TokenPresentation } from "./token.presentation";

interface KnownContract {
  name: string;
  contract: Contract;
}

@Service(BalanceService.name)
export class BalanceService {
  constructor(@Inject(EthereumService.name) private readonly ethereum: EthereumService) {}

  get tokenContracts(): KnownContract[] {
    return KNOWN_TOKENS.map(t => {
      return {
        name: t.name,
        contract: this.ethereum.contract(t.abi, t.address)
      };
    });
  }

  async ethBalance(address: string): Promise<TokenPresentation> {
    const ethBalance = await this.ethereum.balance(address);
    return new TokenPresentation("ETH", "ETH", ethBalance, 18);
  }

  async balanceOf(address: string, tokenContract: KnownContract): Promise<TokenPresentation> {
    const contract = tokenContract.contract;
    const name = this.ethereum.codec.decodeString(await contract.methods.name().call());
    const symbol = tokenContract.name; // this.ethereum.codec.decodeString(await contract.methods.symbol().call());
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
