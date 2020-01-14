import { EthereumService } from "./ethereum.service";
import { EnvService } from "./env.service";
import faker from "faker";

const ETHEREUM_RPC = "foo";

const env: EnvService = {
  readString: jest.fn(() => ETHEREUM_RPC)
};

let ethereumService: EthereumService;

beforeEach(() => {
  ethereumService = new EthereumService(env);
});

function fakeWeb3(e: EthereumService, instance: any) {
  (e as any).web3 = instance;
}

test("block", async () => {
  const blockNumber = faker.random.number();
  const expected = faker.random.alphaNumeric();
  const getBlock = jest.fn(() => expected);
  fakeWeb3(ethereumService, {
    eth: {
      getBlock: getBlock
    }
  });
  const block = await ethereumService.block(blockNumber);
  expect(getBlock).toBeCalledWith(blockNumber);
  expect(block).toEqual(expected);
});

test("transaction", async () => {
  const getTransaction = jest.fn(() => 13);
  fakeWeb3(ethereumService, {
    eth: {
      getTransaction: getTransaction
    }
  });
  const transaction = await ethereumService.transaction("txid");
  expect(getTransaction).toBeCalledWith("txid");
  expect(transaction).toEqual(13);
});

test("transactionReceipt", async () => {
  const getTransactionReceipt = jest.fn(() => 13);
  fakeWeb3(ethereumService, {
    eth: {
      getTransactionReceipt: getTransactionReceipt
    }
  });
  const transactionReceipt = await ethereumService.transactionReceipt("txid");
  expect(getTransactionReceipt).toBeCalledWith("txid");
  expect(transactionReceipt).toEqual(13);
});

test("canonicalAddress for address", async () => {
  const isAddress = jest.fn(() => true);
  fakeWeb3(ethereumService, {
    utils: {
      isAddress: isAddress
    }
  });
  const input = "0x652d38D814bcdF3E0f750A0FaF272Ee96C1F67ed";
  const canonicalAddress = await ethereumService.canonicalAddress(input);
  expect(canonicalAddress).toEqual(input.toLowerCase());
});

test("canonicalAddress for ens name", async () => {
  const address = "0x652d38D814bcdF3E0f750A0FaF272Ee96C1F67ed";
  const ensName = "something.ens";
  const isAddress = jest.fn(() => false);
  const getAddress = jest.fn(() => address);
  fakeWeb3(ethereumService, {
    utils: {
      isAddress: isAddress
    },
    eth: {
      ens: {
        getAddress: getAddress
      }
    }
  });
  const canonicalAddress = await ethereumService.canonicalAddress(ensName);
  expect(canonicalAddress).toEqual(address.toLowerCase());
  expect(getAddress).toBeCalledWith(ensName);
});

test("extendedBlock", async () => {
  const blockNumber = faker.random.number();
  const getBlock = jest.fn(() => {
    return {
      number: blockNumber,
      transactions: ["0xdead", "0xbeaf"]
    };
  });
  const getTransactionReceipt = jest.fn(() => {
    return {
      receipt: true,
      logs: [{ foo: "blah" }]
    };
  });
  const getTransaction = jest.fn(() => {
    return {
      input: "0xdeadbeaf"
    };
  });
  fakeWeb3(ethereumService, {
    utils: {},
    eth: {
      getBlock: getBlock,
      getTransactionReceipt: getTransactionReceipt,
      getTransaction: getTransaction
    }
  });
  const result = await ethereumService.extendedBlock(blockNumber);
  expect(result.number).toEqual(blockNumber);
  expect(result.receipts.length).toEqual(2);
  expect(result.logs.length).toEqual(2);
});

test("latestBlockNumber", async () => {
  const blockNumber = faker.random.number();
  const getBlock = jest.fn(() => {
    return {
      number: blockNumber
    };
  });
  fakeWeb3(ethereumService, {
    eth: {
      getBlock: getBlock
    }
  });
  const result = await ethereumService.latestBlockNumber();
  expect(result).toEqual(blockNumber);
});
