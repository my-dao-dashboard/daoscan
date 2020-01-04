import { OrganisationsService } from "./organisations.service";
import { OrganisationsRepository } from "../storage/organisations.repository";
import { ApplicationsRepository } from "../storage/applications.repository";
import { EthereumService } from "./ethereum.service";
import { BalanceService } from "./balance.service";
import { MessariService } from "./messari.service";
import faker from "faker";

test("tokenContract", async () => {
  const tokenAddress = faker.random.word();
  const tokenAddressFunc = jest.fn(() => tokenAddress);
  const Contract = class {};
  const organisationsRepository = ({} as unknown) as OrganisationsRepository;
  const applicationsRepository = ({ tokenAddress: tokenAddressFunc } as unknown) as ApplicationsRepository;
  const ethereumService = ({
    web3: {
      eth: {
        Contract: Contract
      }
    }
  } as unknown) as EthereumService;
  const balanceService = ({} as unknown) as BalanceService;
  const messariService = ({} as unknown) as MessariService;
  const organisationService = new OrganisationsService(
    organisationsRepository,
    applicationsRepository,
    ethereumService,
    balanceService,
    messariService
  );
  const organisationAddress = faker.random.word();
  const tokenContract = await organisationService.tokenContract(organisationAddress);
  expect(applicationsRepository.tokenAddress).toBeCalled();
  expect(tokenContract).toBeInstanceOf(Contract);
});

test("totalSupply", async () => {
  const tokenAddress = faker.random.word();
  const tokenAddressFunc = jest.fn(() => tokenAddress);
  const tokenName = faker.random.word();
  const tokenSymbol = faker.random.word();
  const tokenDecimals = faker.random.number();
  const tokenTotalSupply = faker.random.number().toString();
  const nameFn = jest.fn(() => tokenName);
  const symbolFn = jest.fn(() => tokenSymbol);
  const decimalsFn = jest.fn(() => tokenDecimals);
  const totalSupplyFn = jest.fn(() => tokenTotalSupply);
  const Contract = class {
    name() {
      return {
        call: nameFn
      };
    }
    symbol() {
      return {
        call: symbolFn
      };
    }
    decimals() {
      return {
        call: decimalsFn
      };
    }
    totalSupply() {
      return {
        call: totalSupplyFn
      };
    }
  };
  const organisationsRepository = ({} as unknown) as OrganisationsRepository;
  const applicationsRepository = ({ tokenAddress: tokenAddressFunc } as unknown) as ApplicationsRepository;
  const ethereumService = ({
    web3: {
      eth: {
        Contract: Contract
      }
    }
  } as unknown) as EthereumService;
  const balanceService = ({} as unknown) as BalanceService;
  const messariService = ({} as unknown) as MessariService;
  const organisationService = new OrganisationsService(
    organisationsRepository,
    applicationsRepository,
    ethereumService,
    balanceService,
    messariService
  );
  const organisationAddress = faker.random.word();
  (organisationService as any).tokenContract = jest.fn(() => ({
    methods: new Contract()
  }));
  const totalSupply = await organisationService.totalSupply(organisationAddress);
  expect(totalSupply.name).toEqual(tokenName);
  expect(totalSupply.symbol).toEqual(tokenSymbol);
  expect(totalSupply.decimals).toEqual(tokenDecimals);
  expect(totalSupply.amount).toEqual(tokenTotalSupply);
});

test("bank when bankAddress found", async () => {
  const bankAddress = faker.random.word();
  const bankAddressFunc = jest.fn(() => bankAddress);
  const organisationsRepository = ({} as unknown) as OrganisationsRepository;
  const applicationsRepository = ({ bankAddress: bankAddressFunc } as unknown) as ApplicationsRepository;
  const ethereumService = ({
    web3: {}
  } as unknown) as EthereumService;

  const ethBalance = faker.random.number().toString();
  const ethBalanceFunc = jest.fn(() => ({ amount: ethBalance, decimals: 18, name: "ETH", symbol: "ETH" }));
  const tokenBalances = [{ amount: "10", decimals: 18, name: "Foo", symbol: "Foo" }];
  const tokenBalancesFunc = jest.fn(() => tokenBalances);
  const balanceService = ({
    ethBalance: ethBalanceFunc,
    tokenBalances: tokenBalancesFunc
  } as unknown) as BalanceService;
  const messariService = ({} as unknown) as MessariService;
  const organisationService = new OrganisationsService(
    organisationsRepository,
    applicationsRepository,
    ethereumService,
    balanceService,
    messariService
  );
  const organisationAddress = faker.random.word();
  const bank = await organisationService.bank(organisationAddress);
  expect(bank.length).toEqual(2);
  expect(bank[0]).toEqual(tokenBalances[0]);
  expect(bank[1]).toEqual({ name: "ETH", symbol: "ETH", decimals: 18, amount: ethBalance });
});

test("bank when bankAddress not found", async () => {
  const bankAddressFunc = jest.fn(() => null);
  const organisationsRepository = ({} as unknown) as OrganisationsRepository;
  const applicationsRepository = ({ bankAddress: bankAddressFunc } as unknown) as ApplicationsRepository;
  const ethereumService = ({
    web3: {}
  } as unknown) as EthereumService;

  const balanceService = ({} as unknown) as BalanceService;
  const messariService = ({} as unknown) as MessariService;
  const organisationService = new OrganisationsService(
    organisationsRepository,
    applicationsRepository,
    ethereumService,
    balanceService,
    messariService
  );
  const organisationAddress = faker.random.word();
  const bank = await organisationService.bank(organisationAddress);
  expect(bank.length).toEqual(0);
});

test("priceOfShareUsd", async () => {
  const organisationsRepository = ({} as unknown) as OrganisationsRepository;
  const applicationsRepository = ({} as unknown) as ApplicationsRepository;
  const ethereumService = ({
    web3: {}
  } as unknown) as EthereumService;
  const balanceService = ({} as unknown) as BalanceService;
  const usdPriceFunc = jest.fn(() => 2);
  const messariService = ({ usdPrice: usdPriceFunc } as unknown) as MessariService;
  const organisationService = new OrganisationsService(
    organisationsRepository,
    applicationsRepository,
    ethereumService,
    balanceService,
    messariService
  );
  const bank = [{ name: "WETH", symbol: "WETH", decimals: 18, amount: "1000000000000000000" }];
  const totalSupply = { name: "Share", symbol: "Sh", decimals: 0, amount: "1" };
  const price = await organisationService.shareValueUsd(totalSupply, bank);
  expect(price).toEqual(2);
});

test("shareValue", async () => {
  const symbol = "RUB";
  const usdPrice = 0.2;

  const organisationsRepository = ({} as unknown) as OrganisationsRepository;
  const applicationsRepository = ({} as unknown) as ApplicationsRepository;
  const ethereumService = ({
    web3: {}
  } as unknown) as EthereumService;
  const balanceService = ({} as unknown) as BalanceService;
  const usdPriceFunc = jest.fn(() => usdPrice);
  const messariService = ({ usdPrice: usdPriceFunc } as unknown) as MessariService;
  const organisationService = new OrganisationsService(
    organisationsRepository,
    applicationsRepository,
    ethereumService,
    balanceService,
    messariService
  );
  const bank = [{ name: "WETH", symbol: "WETH", decimals: 18, amount: "1000000000000000000" }];
  const totalSupply = { name: "Share", symbol: "Sh", decimals: 0, amount: "1" };
  (organisationService as any).totalSupply = jest.fn(() => totalSupply);
  (organisationService as any).bank = jest.fn(() => bank);
  (organisationService as any).shareValueUsd = jest.fn(() => 1);
  const organisationAddress = faker.random.word();
  const value = await organisationService.shareValue(organisationAddress, symbol);
  expect(value.name).toEqual(symbol);
  expect(value.symbol).toEqual(symbol);
  expect(value.amount).toEqual((10000 / usdPrice).toString());
  expect(value.decimals).toEqual(4);
});
