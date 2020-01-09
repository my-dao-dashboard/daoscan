import { AbiCodec } from "./abi-codec";
import Web3 from "web3";

let abiCodec: AbiCodec;

beforeEach(() => {
  abiCodec = new AbiCodec(new Web3());
});

test("decodeParameters", () => {
  const abi = [
    { name: "name", type: "string" },
    { name: "holders", type: "address[]" },
    { name: "tokens", type: "uint256[]" },
    { name: "supportNeeded", type: "uint64" },
    { name: "minAcceptanceQuorum", type: "uint64" },
    { name: "voteDuration", type: "uint64" }
  ];
  const hex =
    "0x00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000006f05b59d3b20000000000000000000000000000000000000000000000000000006a94d74f4300000000000000000000000000000000000000000000000000000000000000000e10000000000000000000000000000000000000000000000000000000000000000e6d7964616f64617368626f617264000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000070564145fa8e8a15348ef0190e6b7c07a212046200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a7640000";
  const result = abiCodec.decodeParameters(abi, hex);
  expect(result.name).toEqual("mydaodashboard");
  expect(result.holders).toEqual(["0x70564145fA8e8A15348EF0190e6B7c07A2120462"]);
  expect(result.tokens).toEqual(["1000000000000000000"]);
  expect(result.supportNeeded).toEqual("500000000000000000");
  expect(result.minAcceptanceQuorum).toEqual("30000000000000000");
  expect(result.voteDuration).toEqual("3600");
});

test("decodeLog", async () => {
  const input = [{ indexed: false, name: "dao", type: "address" }];
  const hex = "0x0000000000000000000000003c307fefd3d71c3ca8a3c26539ef4d47c61b6565";
  const result = abiCodec.decodeLog(input, hex, []);
  expect(result.dao.toLowerCase()).toEqual("0x3c307fefd3d71c3ca8a3c26539ef4d47c61b6565");
});

test("encodeFunctionCall", () => {
  const result = abiCodec.encodeFunctionCall(
    {
      name: "kernel",
      type: "function",
      inputs: []
    },
    []
  );
  expect(result).toEqual("0xd4aae0c4");
});