import { Inject, Service } from "typedi";
import { EthereumService } from "./ethereum.service";
import Web3 from "web3";
import { TokenGraphql } from "../api/token.graphql";
import { TOKEN_ABI } from "../scraping/aragon.constants";
import { Contract } from "web3-eth-contract";
import { decodeString } from "../shared/decode-string";
import { SAI_ABI } from "./sai.abi";

const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const SAI_ADDRESS = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359";
const ANT_ADDRESS = "0x960b236A07cf122663c4303350609A66A7B288C0";
const GEN_ADDRESS = "0x543ff227f64aa17ea132bf9886cab5db55dcaddf";
const TACO_ADDRESS = "0x36efe52b14e4d0ca4e3bd492488272e1fb2d7e1b";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

@Service(BalanceService.name)
export class BalanceService {
  private readonly web3: Web3;
  private readonly tokenContracts: Contract[];

  constructor(@Inject(EthereumService.name) private readonly ethereum: EthereumService) {
    this.web3 = ethereum.web3;
    this.tokenContracts = [
      new this.web3.eth.Contract(TOKEN_ABI, ANT_ADDRESS),
      new this.web3.eth.Contract(TOKEN_ABI, DAI_ADDRESS),
      new this.web3.eth.Contract(SAI_ABI, SAI_ADDRESS),
      new this.web3.eth.Contract(TOKEN_ABI, GEN_ADDRESS),
      new this.web3.eth.Contract(TOKEN_ABI, TACO_ADDRESS),
      new this.web3.eth.Contract(TOKEN_ABI, WETH_ADDRESS)
    ];
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
