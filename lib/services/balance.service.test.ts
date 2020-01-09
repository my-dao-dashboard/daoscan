import { BalanceService } from "./balance.service";
import { EthereumService } from "./ethereum.service";
import { Contract } from "web3-eth-contract";
import faker from "faker";

const FakeContract = jest.fn();

test("ethBalance", async () => {
  const balance = "10";
  const getBalance = jest.fn(() => balance);
  const ethereumService = ({
    web3: {
      eth: {
        getBalance: getBalance
      }
    }
  } as unknown) as EthereumService;
  const service = new BalanceService(ethereumService);
  const address = faker.random.alphaNumeric(10);
  const ethBalance = await service.ethBalance(address);
  expect(getBalance).toBeCalledWith(address);
  expect(ethBalance.decimals).toEqual(18);
  expect(ethBalance.amount).toEqual(balance);
  expect(ethBalance.symbol).toEqual("ETH");
  expect(ethBalance.name).toEqual("ETH");
});

test("balanceOf", async () => {
  const balance = faker.random.number().toString();
  const name = faker.random.words(1);
  const symbol = faker.random.words(1);
  const decimals = faker.random.number();
  const ethereumService = ({} as unknown) as EthereumService;
  const service = new BalanceService(ethereumService);
  const address = faker.random.alphaNumeric(10);
  const nameCall = jest.fn(() => name);
  const symbolCall = jest.fn(() => symbol);
  const balanceOfCall = jest.fn(() => balance);
  const decimalsCall = jest.fn(() => decimals);
  const contract = {
    methods: {
      name: jest.fn(() => {
        return {
          call: nameCall
        };
      }),
      symbol: jest.fn(() => {
        return {
          call: symbolCall
        };
      }),
      balanceOf: jest.fn(() => {
        return {
          call: balanceOfCall
        };
      }),
      decimals: jest.fn(() => {
        return {
          call: decimalsCall
        };
      })
    }
  };
  const tokenBalance = await service.balanceOf(address, contract as Contract);
  expect(nameCall).toBeCalled();
  expect(symbolCall).toBeCalled();
  expect(decimalsCall).toBeCalled();
  expect(contract.methods.balanceOf).toBeCalledWith(address);
  expect(balanceOfCall).toBeCalled();

  expect(tokenBalance.name).toEqual(name);
  expect(tokenBalance.symbol).toEqual(symbol);
  expect(tokenBalance.decimals).toEqual(decimals);
  expect(tokenBalance.amount).toEqual(balance);
});

test("balanceOf", async () => {
  const ethereumService = ({
    web3: {
      eth: {
        Contract: FakeContract
      }
    }
  } as unknown) as EthereumService;
  const service = new BalanceService(ethereumService);
  const address = faker.random.alphaNumeric(10);
  const balanceOf = {
    symbol: faker.random.alphaNumeric(10),
    name: faker.random.alphaNumeric(10),
    decimals: faker.random.number(),
    amount: faker.random.number().toString()
  };
  // @ts-ignore
  service.balanceOf = jest.fn(() => {
    return balanceOf;
  });
  const tokenBalances = await service.tokenBalances(address);
  expect(tokenBalances.every(t => t === balanceOf)).toBeTruthy();
});
