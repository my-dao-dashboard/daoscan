import { AragonScraper } from "./aragon.scraper";
import fs from "fs";
import path from "path";
import { EthereumService, ExtendedBlock } from "../services/ethereum.service";
import Web3 from "web3";
import { DynamoService } from "../storage/dynamo.service";
import { ORGANISATION_EVENT } from "../shared/organisation-events";
import { PLATFORM } from "../shared/platform";

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
