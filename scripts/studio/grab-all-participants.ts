import axios from "axios";
import axiosRetry from "axios-retry";
import dotenv from "dotenv";
import path from "path";
import Web3 from "web3";
import _ from "lodash";
import { AbiItem } from "web3-utils";
import { Container } from "typedi";
import { ApplicationRepository } from "../../lib/storage/application.repository";
import ERC20_TOKEN_ABI from "../../lib/querying/erc20-token.abi.json";
import { OrganisationRepository } from "../../lib/storage/organisation.repository";
import { sleep } from "../../lib/shared/sleep";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/e201ebd046304d9d89a598b6c73baa8c"));

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const kernelABI: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "proxyType",
    outputs: [{ name: "proxyTypeId", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "bytes32" },
      { name: "", type: "bytes32" }
    ],
    name: "apps",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isDepositable",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "implementation",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "recoveryVaultAppId",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "_kernelImpl", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "sender", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "ProxyDeposit",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "namespace", type: "bytes32" },
      { indexed: true, name: "appId", type: "bytes32" },
      { indexed: false, name: "app", type: "address" }
    ],
    name: "SetApp",
    type: "event"
  }
];

async function main() {
  const organisationRepository = Container.get(OrganisationRepository);
  const organisations = await organisationRepository.all();
  const addresses = organisations.map(org => org.address.toLowerCase());
  for (let index = 0; index < addresses.length; index++) {
    const address = addresses[index];
    const applicationRepository = Container.get(ApplicationRepository);
    const shareTokenAddress = await applicationRepository.tokenAddress(address);
    if (shareTokenAddress) {
      const shareToken = new web3.eth.Contract(ERC20_TOKEN_ABI as AbiItem[], shareTokenAddress);
      const events = await shareToken.getPastEvents("allEvents", {
        fromBlock: 0,
        toBlock: "latest",
        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
      });
      const blockNumbers = _.uniq(events.map(event => Number(event.blockNumber)));
      await Promise.all(
        blockNumbers.map(async n => {
          const response = await axios.post("https://api.daoscan.net/block", {
            id: n
          });
          console.log(JSON.stringify(response.data, null, 4));
        })
      );
      await sleep(1000);
    }
    console.log(`Done with ${address}: ${index}/${addresses.length}`);
  }
}

main()
  .then(() => {
    // Do Nothing
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
