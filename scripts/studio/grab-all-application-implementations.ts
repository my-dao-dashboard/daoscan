import axios from "axios";
import axiosRetry from "axios-retry";
import dotenv from "dotenv";
import path from "path";
import Web3 from "web3";
import { Container } from "typedi";
import { ApplicationRepository } from "../../lib/storage/application.repository";
import { APP_ID } from "../../lib/storage/applications.const";
import * as csv from "csv-writer";
import { AbiItem } from "web3-utils";
import crypto from "crypto";
import { Application } from "../../lib/storage/application.row";
import _ from "lodash";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const web3 = new Web3(new Web3.providers.HttpProvider("INFURA_KEY"));

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const applicationRepository = Container.get(ApplicationRepository);

const EXCLUDED = [APP_ID.SHARE.toString(), APP_ID.MOLOCH_1_BANK.toString()];

const PROXY_ABI = [
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
    name: "appId",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "kernel",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "_kernel", type: "address" },
      { name: "_appId", type: "bytes32" },
      { name: "_initializePayload", type: "bytes" }
    ],
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
  }
];

interface Record {
  address: string;
  name: string;
  appId: string;
  implementationAddress: string;
  verified: boolean;
  abiDigest: string;
  implementationVerified: boolean;
  implementationAbiDigest: string;
}

let verifications = new Map<string, [boolean, string]>();

const writer = csv.createObjectCsvWriter({
  path: "~/Desktop/a.csv",
  header: [
    { id: "address", title: "address" },
    { id: "name", title: "name" },
    { id: "appId", title: "appId" },
    { id: "implementationAddress", title: "implementationAddress" },
    { id: "verified", title: "verified" },
    { id: "abiDigest", title: "ABI Digest" },
    { id: "implementationVerified", title: "implementationVerified" },
    { id: "implementationAbiDigest", title: "Implementation ABI Digest" }
  ]
});
// let data: Record[] = [];

async function isVerified(address: string): Promise<[boolean, string]> {
  if (verifications.has(address)) {
    return verifications.get(address)!;
  } else {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=H9UYS344NDYVSRAIPM9U47ZWR7327EUGDT`
    );
    const data = response.data;
    const abi = data?.result;
    const verified: boolean = Boolean(data?.result);
    const digest: string = crypto
      .createHash("sha256")
      .update(abi || "")
      .digest("hex");
    verifications.set(address, [verified, digest]);
    return [verified, digest];
  }
}

async function fetchOne(application: Application) {
  if (!EXCLUDED.includes(application.appId)) {
    const contract = new web3.eth.Contract(PROXY_ABI as AbiItem[], application.address);
    const verified = await isVerified(application.address);
    const implementation = await contract.methods.implementation().call();
    const implementationVerified = await isVerified(implementation);
    // data.push({
    //   address: application.address,
    //   name: application.name,
    //   appId: application.appId,
    //   implementationAddress: implementation.toLowerCase(),
    //   verified: verified[0],
    //   abiDigest: verified[1],
    //   implementationVerified: implementationVerified[0],
    //   implementationAbiDigest: implementationVerified[1]
    // });
    await writer.writeRecords([{
      address: application.address,
      name: application.name,
      appId: application.appId,
      implementationAddress: implementation.toLowerCase(),
      verified: verified[0],
      abiDigest: verified[1],
      implementationVerified: implementationVerified[0],
      implementationAbiDigest: implementationVerified[1]
    }]);
  }
}

async function main() {
  const applications = await applicationRepository.all();
  console.log("Got applications", applications.length);
  const start = 0;
  const stop = applications.length;
  console.log(`Parsing from ${start} to ${stop}`);
  const PAGE = 20;
  const chunks = _.chunk(applications, PAGE);
  let n = 0;
  for (let chunk of chunks) {
    await Promise.all(
      chunk.map(async application => {
        await fetchOne(application);
      })
    );
    console.log(`Done with ${n} of ${stop}`);
    n = n + PAGE;
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
