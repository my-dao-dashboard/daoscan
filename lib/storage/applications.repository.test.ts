import { ApplicationsRepository, FIELD } from "./applications.repository";
import { IEnvService } from "../services/env.service";
import faker from "faker";
import { DynamoService } from "./dynamo.service";
import { APP_ID } from "../shared/app-id";
import { PLATFORM } from "../shared/platform";

const APPLICATIONS_TABLE = faker.random.alphaNumeric();

const env: IEnvService = {
  readString: jest.fn(() => APPLICATIONS_TABLE)
};

test("save", async () => {
  const dynamo = ({
    put: jest.fn()
  } as unknown) as DynamoService;
  const repository = new ApplicationsRepository(dynamo, env);
  const item = {
    platform: PLATFORM.ARAGON,
    organisationAddress: faker.random.alphaNumeric(10).toUpperCase(),
    appId: faker.random.alphaNumeric(10).toUpperCase(),
    proxyAddress: faker.random.alphaNumeric(),
    txid: faker.random.alphaNumeric(),
    blockNumber: faker.random.number(),
    timestamp: faker.random.number()
  };
  await repository.save(item);
  expect(dynamo.put).toBeCalledWith({
    TableName: APPLICATIONS_TABLE,
    Item: {
      ...item,
      organisationAddress: item.organisationAddress.toLowerCase(),
      appId: item.appId.toLowerCase()
    }
  });
});

test("bankAddress found", async () => {
  const RETURNED = faker.random.alphaNumeric(10);
  const dynamo = ({
    get: jest.fn(() => {
      return {
        Item: {
          proxyAddress: RETURNED
        }
      };
    })
  } as unknown) as DynamoService;
  const repository = new ApplicationsRepository(dynamo, env);
  const organisationAddress = faker.random.alphaNumeric(10).toUpperCase();
  const bankAddress = await repository.bankAddress(organisationAddress);
  expect(bankAddress).toEqual(RETURNED);
  expect(dynamo.get).toBeCalledWith({
    TableName: APPLICATIONS_TABLE,
    ProjectionExpression: [FIELD.PROXY_ADDRESS].join(","),
    Key: {
      organisationAddress: organisationAddress.toLowerCase(),
      appId: APP_ID.ARAGON_VAULT
    }
  });
});

test("bankAddress not found", async () => {
  const dynamo = ({
    get: jest.fn(() => {
      return {
        Item: null
      };
    })
  } as unknown) as DynamoService;
  const repository = new ApplicationsRepository(dynamo, env);
  const organisationAddress = faker.random.alphaNumeric(10).toUpperCase();
  const bankAddress = await repository.bankAddress(organisationAddress);
  expect(bankAddress).toBeUndefined();
});

test("tokenAddress found", async () => {
  const RETURNED = faker.random.alphaNumeric(10);
  const dynamo = ({
    get: jest.fn(() => {
      return {
        Item: {
          proxyAddress: RETURNED
        }
      };
    })
  } as unknown) as DynamoService;
  const repository = new ApplicationsRepository(dynamo, env);
  const organisationAddress = faker.random.alphaNumeric(10).toUpperCase();
  const tokenAddress = await repository.tokenAddress(organisationAddress);
  expect(tokenAddress).toEqual(RETURNED);
  expect(dynamo.get).toBeCalledWith({
    TableName: APPLICATIONS_TABLE,
    ProjectionExpression: [FIELD.PROXY_ADDRESS].join(","),
    Key: {
      organisationAddress: organisationAddress.toLowerCase(),
      appId: APP_ID.SHARE
    }
  });
});

test("tokenAddress not found", async () => {
  const dynamo = ({
    get: jest.fn(() => {
      return {
        Item: null
      };
    })
  } as unknown) as DynamoService;
  const repository = new ApplicationsRepository(dynamo, env);
  const organisationAddress = faker.random.alphaNumeric(10).toUpperCase();
  const tokenAddress = await repository.tokenAddress(organisationAddress);
  expect(tokenAddress).toEqual(undefined);
  expect(dynamo.get).toBeCalledWith({
    TableName: APPLICATIONS_TABLE,
    ProjectionExpression: [FIELD.PROXY_ADDRESS].join(","),
    Key: {
      organisationAddress: organisationAddress.toLowerCase(),
      appId: APP_ID.SHARE
    }
  });
});

test("tokenControllerAddress found", async () => {
  const RETURNED = faker.random.alphaNumeric(10);
  const dynamo = ({
    get: jest.fn(() => {
      return {
        Item: {
          proxyAddress: RETURNED
        }
      };
    })
  } as unknown) as DynamoService;
  const repository = new ApplicationsRepository(dynamo, env);
  const organisationAddress = faker.random.alphaNumeric(10).toUpperCase();
  const tokenControllerAddress = await repository.tokenControllerAddress(organisationAddress);
  expect(tokenControllerAddress).toEqual(RETURNED);
  expect(dynamo.get).toBeCalledWith({
    TableName: APPLICATIONS_TABLE,
    ProjectionExpression: [FIELD.PROXY_ADDRESS].join(","),
    Key: {
      organisationAddress: organisationAddress.toLowerCase(),
      appId: APP_ID.ARAGON_TOKEN_CONTROLLER
    }
  });
});

test("tokenControllerAddress not found", async () => {
  const dynamo = ({
    get: jest.fn(() => {
      return {
        Item: null
      };
    })
  } as unknown) as DynamoService;
  const repository = new ApplicationsRepository(dynamo, env);
  const organisationAddress = faker.random.alphaNumeric(10).toUpperCase();
  const tokenControllerAddress = await repository.tokenControllerAddress(organisationAddress);
  expect(tokenControllerAddress).toEqual(undefined);
  expect(dynamo.get).toBeCalledWith({
    TableName: APPLICATIONS_TABLE,
    ProjectionExpression: [FIELD.PROXY_ADDRESS].join(","),
    Key: {
      organisationAddress: organisationAddress.toLowerCase(),
      appId: APP_ID.ARAGON_TOKEN_CONTROLLER
    }
  });
});
