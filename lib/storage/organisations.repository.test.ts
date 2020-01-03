import { OrganisationsRepository } from "./organisations.repository";
import { DynamoService } from "./dynamo.service";
import { EnvService } from "../services/env.service";
import faker from "faker";
import { NotFoundError } from "../shared/errors";
import {PLATFORM} from "../shared/platform";

const ORGANISATIONS_TABLE = faker.random.alphaNumeric(10);

const env: EnvService = {
  readString: jest.fn(() => ORGANISATIONS_TABLE)
};

test("byAddress found", async () => {
  const item = {
    address: faker.random.alphaNumeric(10),
    name: faker.random.alphaNumeric(10),
    platform: PLATFORM.ARAGON,
    txid: faker.random.alphaNumeric(10),
    blockNumber: faker.random.number(),
    timestamp: faker.random.number()
  };
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: [item]
      };
    })
  } as unknown) as DynamoService;
  const repository = new OrganisationsRepository(dynamo, env);
  const address = faker.random.alphaNumeric(10);
  const found = await repository.byAddress(address);
  expect(found).toEqual(item);
  expect(dynamo.query).toBeCalledWith({
    TableName: ORGANISATIONS_TABLE,
    ProjectionExpression: "address, #orgName, platform, txid, #orgTimestamp, blockNumber",
    ExpressionAttributeNames: {
      "#orgName": "name",
      "#orgTimestamp": "timestamp"
    },
    KeyConditionExpression: "address = :address",
    ExpressionAttributeValues: {
      ":address": address.toLowerCase()
    },
    Limit: 1
  });
});

test("byAddress not found", async () => {
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: []
      };
    })
  } as unknown) as DynamoService;
  const repository = new OrganisationsRepository(dynamo, env);
  const address = faker.random.alphaNumeric(10);
  await expect(repository.byAddress(address)).rejects.toThrow(NotFoundError);
});
