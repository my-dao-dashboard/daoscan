import { AragonScraper } from "./aragon.scraper";
import fs from "fs";
import path from "path";
import { EthereumService, ExtendedBlock } from "../services/ethereum.service";
import Web3 from "web3";
import { DynamoService } from "../storage/dynamo.service";
import { ORGANISATION_EVENT } from "../shared/organisation-events";
import { PLATFORM } from "../shared/platform";
import { AbiCodec } from "../services/abi-codec";

const BLOCK_8403326 = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/testing/block-8403326.json")).toString()
) as ExtendedBlock;

const BLOCK_8000373 = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/testing/block-8000373.json")).toString()
) as ExtendedBlock;

test("createdFromTransactions empty", async () => {
  const web3 = ({} as unknown) as Web3;
  const dynamo = ({} as unknown) as DynamoService;
  const ethereum = ({} as unknown) as EthereumService;
  const aragonScraper = new AragonScraper(web3, dynamo, ethereum);
  const createdFrom = await aragonScraper.createdFromTransactions(BLOCK_8000373);
  expect(createdFrom.length).toEqual(0);
});

test("createdFromTransactions", async () => {
  const web3 = ({} as unknown) as Web3;
  const dynamo = ({} as unknown) as DynamoService;
  const canonicalAddressFunc = jest.fn(() => "0xb788256177f8398babddb1118bc4aa0557ed8c65");
  const decodeParametersFunc = jest.fn(() => {
    return {
      name: "mydaodashboard",
      holders: ["0x70564145fA8e8A15348EF0190e6B7c07A2120462"],
      tokens: ["1000000000000000000"],
      supportNeeded: "500000000000000000",
      minAcceptanceQuorum: "30000000000000000",
      voteDuration: "3600"
    };
  });
  const ethereum = ({
    canonicalAddress: canonicalAddressFunc,
    codec: { decodeParameters: decodeParametersFunc }
  } as unknown) as EthereumService;
  const aragonScraper = new AragonScraper(web3, dynamo, ethereum);
  const createdFrom = await aragonScraper.createdFromTransactions(BLOCK_8403326);
  expect(createdFrom.length).toEqual(1);
  const createdEvent = createdFrom[0];
  expect(createdEvent.kind).toEqual(ORGANISATION_EVENT.CREATED);
  expect(createdEvent.platform).toEqual(PLATFORM.ARAGON);
  expect(createdEvent.name).toEqual("mydaodashboard.aragonid.eth");
  expect(createdEvent.address).toEqual("0xb788256177f8398babddb1118bc4aa0557ed8c65");
  expect(createdEvent.txid).toEqual("0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56");
  expect(createdEvent.blockNumber).toEqual(8403326);
  expect(createdEvent.timestamp).toEqual(1566520194);
  expect(canonicalAddressFunc).toBeCalledWith("mydaodashboard.aragonid.eth");
  expect(decodeParametersFunc).toBeCalledWith(
    [
      { name: "name", type: "string" },
      { name: "holders", type: "address[]" },
      { name: "tokens", type: "uint256[]" },
      { name: "supportNeeded", type: "uint64" },
      { name: "minAcceptanceQuorum", type: "uint64" },
      { name: "voteDuration", type: "uint64" }
    ],
    "0x00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000006f05b59d3b20000000000000000000000000000000000000000000000000000006a94d74f4300000000000000000000000000000000000000000000000000000000000000000e10000000000000000000000000000000000000000000000000000000000000000e6d7964616f64617368626f617264000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000070564145fa8e8a15348ef0190e6b7c07a212046200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a7640000"
  );
});

test("createdFromEvents", async () => {
  const web3 = ({} as unknown) as Web3;
  const dynamo = ({} as unknown) as DynamoService;
  const decodeLogFunc = jest.fn(() => {
    return {
      dao: "0x3c307fefd3d71c3ca8a3c26539ef4d47c61b6565"
    };
  });
  const ethereum = ({ codec: { decodeLog: decodeLogFunc } } as unknown) as EthereumService;
  const aragonScraper = new AragonScraper(web3, dynamo, ethereum);
  const createdFrom = await aragonScraper.createdFromEvents(BLOCK_8000373);
  expect(createdFrom.length).toEqual(1);
  const createdEvent = createdFrom[0];
  expect(createdEvent.kind).toEqual(ORGANISATION_EVENT.CREATED);
  expect(createdEvent.platform).toEqual(PLATFORM.ARAGON);
  expect(createdEvent.name).toEqual("0x3c307fefd3d71c3ca8a3c26539ef4d47c61b6565");
  expect(createdEvent.address).toEqual("0x3c307fefd3d71c3ca8a3c26539ef4d47c61b6565");
  expect(createdEvent.txid).toEqual("0x2af31fa3d98cf7b2daf7b761e11cc867e89e17cb674bdd260f655cc0a3f780b1");
  expect(createdEvent.blockNumber).toEqual(8000373);
  expect(createdEvent.timestamp).toEqual(1561104795);
});

test("appInstalledEvents", async () => {
  const EXPECTED = [
    {
      kind: "APP_INSTALLED",
      platform: "ARAGON",
      organisationAddress: "0xb788256177f8398babddb1118bc4aa0557ed8c65",
      appId: "0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a",
      proxyAddress: "0x0e35B49466c4bff5B91d677c4d90727a15225e4a",
      txid: "0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56",
      blockNumber: 8403326,
      timestamp: 1566520194
    },
    {
      kind: "APP_INSTALLED",
      platform: "ARAGON",
      organisationAddress: "0xb788256177f8398babddb1118bc4aa0557ed8c65",
      appId: "0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61",
      proxyAddress: "0x9d2A158f39b6E495BacAC5fa40e584a90cc0eBD7",
      txid: "0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56",
      blockNumber: 8403326,
      timestamp: 1566520194
    },
    {
      kind: "APP_INSTALLED",
      platform: "ARAGON",
      organisationAddress: "0xb788256177f8398babddb1118bc4aa0557ed8c65",
      appId: "0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4",
      proxyAddress: "0xe9FB3a91a30b9B61EE9C50cDc20864EeB9d4c906",
      txid: "0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56",
      blockNumber: 8403326,
      timestamp: 1566520194
    },
    {
      kind: "APP_INSTALLED",
      platform: "ARAGON",
      organisationAddress: "0xb788256177f8398babddb1118bc4aa0557ed8c65",
      appId: "0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1",
      proxyAddress: "0xf78d15EEe67341Ad81A6F843d49e7921c41F4715",
      txid: "0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56",
      blockNumber: 8403326,
      timestamp: 1566520194
    },
    {
      kind: "APP_INSTALLED",
      platform: "ARAGON",
      organisationAddress: "0xb788256177f8398babddb1118bc4aa0557ed8c65",
      appId: "0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae",
      proxyAddress: "0xF805d7c794d1ed8A3F5EDB6F09c19b0B25CbdA88",
      txid: "0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56",
      blockNumber: 8403326,
      timestamp: 1566520194
    },
    {
      kind: "APP_INSTALLED",
      platform: "ARAGON",
      organisationAddress: "0xb788256177f8398babddb1118bc4aa0557ed8c65",
      appId: "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f",
      proxyAddress: "0x189445C662F5c74Ed8Da964Dc0e56a9657D8E16F",
      txid: "0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56",
      blockNumber: 8403326,
      timestamp: 1566520194
    },
    {
      kind: "APP_INSTALLED",
      platform: "ARAGON",
      organisationAddress: "0xb788256177f8398babddb1118bc4aa0557ed8c65",
      appId: "ds:share",
      proxyAddress: "0xTOKEN",
      txid: "0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56",
      blockNumber: 8403326,
      timestamp: 1566520194
    }
  ];
  const web3 = new Web3();
  const codec = new AbiCodec(web3);
  const dynamo = ({} as unknown) as DynamoService;
  const tokenCall = jest.fn(() => "0xTOKEN");
  const contractFunc = jest.fn(() => {
    return {
      methods: {
        token: jest.fn(() => {
          return {
            call: tokenCall
          };
        })
      }
    };
  });
  const ethereum = ({ web3, codec, contract: contractFunc } as unknown) as EthereumService;
  const aragonScraper = new AragonScraper(web3, dynamo, ethereum);
  (aragonScraper as any).kernelAddress = jest.fn(async () => "0xb788256177F8398babdDb1118bc4aa0557Ed8c65");
  const appsInstalled = await aragonScraper.appInstalledEvents(BLOCK_8403326);
  expect(appsInstalled.length).toEqual(7);
  expect(appsInstalled).toEqual(EXPECTED);
});

test("kernelAddress", async () => {
  const web3 = new Web3();
  const codec = new AbiCodec(web3);
  const dynamo = ({} as unknown) as DynamoService;
  const callFunc = jest.fn(() => "0x000000000000000000000000b788256177f8398babddb1118bc4aa0557ed8c65");
  const ethereum = ({ web3, codec, call: callFunc } as unknown) as EthereumService;
  const aragonScraper = new AragonScraper(web3, dynamo, ethereum);
  const actual = await aragonScraper.kernelAddress("0x189445c662f5c74ed8da964dc0e56a9657d8e16f");
  expect(actual).toEqual("0xb788256177F8398babdDb1118bc4aa0557Ed8c65");
  expect(callFunc).toBeCalledWith({ to: "0x189445c662f5c74ed8da964dc0e56a9657d8e16f", data: '0xd4aae0c4' });
});
