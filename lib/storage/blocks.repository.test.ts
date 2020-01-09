import { BlocksRepository } from "./blocks.repository";
import { IEnvService } from "../services/env.service";
import faker from "faker";
import { IDynamoService } from "./dynamo.service";

const BLOCKS_TABLE = faker.random.alphaNumeric();

const env: IEnvService = {
  readString: jest.fn(() => BLOCKS_TABLE)
};

test("markParsed", async () => {
  const put = jest.fn();
  const dynamo = ({
    put
  } as unknown) as IDynamoService;
  const repository = new BlocksRepository(dynamo, env);
  const id = faker.random.number();
  await repository.markParsed(id);
  expect(put).toBeCalledWith({
    TableName: BLOCKS_TABLE,
    Item: {
      blockNumber: id
    }
  });
});

test("isPresent true", async () => {
  const get = jest.fn(() => {
    return {
      Item: 1
    };
  });
  const dynamo = ({
    get
  } as unknown) as IDynamoService;
  const repository = new BlocksRepository(dynamo, env);
  const id = faker.random.number();
  const result = await repository.isPresent(id);
  expect(result).toBeTruthy();
  expect(get).toBeCalledWith({
    TableName: BLOCKS_TABLE,
    ProjectionExpression: "blockNumber",
    Key: {
      blockNumber: id
    }
  });
});

test("isPresent false", async () => {
  const get = jest.fn(() => {
    return {
      Item: null
    };
  });
  const dynamo = ({
    get
  } as unknown) as IDynamoService;
  const repository = new BlocksRepository(dynamo, env);
  const id = faker.random.number();
  const result = await repository.isPresent(id);
  expect(result).toBeFalsy();
  expect(get).toBeCalledWith({
    TableName: BLOCKS_TABLE,
    ProjectionExpression: "blockNumber",
    Key: {
      blockNumber: id
    }
  });
});
