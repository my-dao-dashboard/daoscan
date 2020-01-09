import { AbiItem } from "web3-utils";
import ERC20_TOKEN_ABI from "./erc20-token.abi.json";
import SAI_TOKEN_ABI from "./sai-token.abi.json";

interface KnownToken {
  name: string;
  address: string;
  abi: AbiItem[];
}

export const KNOWN_TOKENS: KnownToken[] = [
  { name: "ANT", address: "0x960b236A07cf122663c4303350609A66A7B288C0", abi: ERC20_TOKEN_ABI as AbiItem[] },
  { name: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f", abi: ERC20_TOKEN_ABI as AbiItem[] },
  { name: "GEN", address: "0x543ff227f64aa17ea132bf9886cab5db55dcaddf", abi: ERC20_TOKEN_ABI as AbiItem[] },
  { name: "TACO", address: "0x36efe52b14e4d0ca4e3bd492488272e1fb2d7e1b", abi: ERC20_TOKEN_ABI as AbiItem[] },
  { name: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", abi: ERC20_TOKEN_ABI as AbiItem[] },
  { name: "SAI", address: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359", abi: SAI_TOKEN_ABI as AbiItem[] }
];
