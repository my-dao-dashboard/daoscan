import { DynamoService } from "./dynamo.service";
import AWS from "aws-sdk";
import faker from "faker";

const ERROR = new Error("Oops!");

test("constructor", () => {
  const d = new DynamoService();
  const client = (d as any).client;
  expect(client).toBeInstanceOf(AWS.DynamoDB.DocumentClient);
});

test("createSet", () => {
  const client = ({
    createSet: jest.fn()
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const list = [faker.random.alphaNumeric(), faker.random.alphaNumeric()];
  const options = { validate: true };
  d.createSet(list, options);
  expect(client.createSet).toBeCalledWith(list, options);
});

test("scan", async () => {
  const response = {
    Items: [1, 2, 3]
  };
  const scan = jest.fn((payload, callback) => {
    callback(null, response);
  });
  const client = ({
    scan
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const query = {
    TableName: faker.random.alphaNumeric(),
    ProjectionExpression: faker.random.alphaNumeric()
  };
  const result = await d.scan(query);
  expect(client.scan).toBeCalledTimes(1);
  expect(scan.mock.calls[0][0]).toEqual(query);
  expect(result).toEqual(response);
});

test("scan error", async () => {
  const scan = jest.fn((payload, callback) => {
    callback(ERROR);
  });
  const client = ({
    scan
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const query = {
    TableName: faker.random.alphaNumeric(),
    ProjectionExpression: faker.random.alphaNumeric()
  };
  await expect(d.scan(query)).rejects.toThrow(ERROR);
});

test("query", async () => {
  const response = {
    Items: [1, 2, 3]
  };
  const query = jest.fn((payload, callback) => {
    callback(null, response);
  });
  const client = ({
    query
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    ProjectionExpression: faker.random.alphaNumeric()
  };
  const result = await d.query(payload);
  expect(client.query).toBeCalledTimes(1);
  expect(query.mock.calls[0][0]).toEqual(payload);
  expect(result).toEqual(response);
});

test("query error", async () => {
  const query = jest.fn((payload, callback) => {
    callback(ERROR);
  });
  const client = ({
    query
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    ProjectionExpression: faker.random.alphaNumeric()
  };
  await expect(d.query(payload)).rejects.toThrow(ERROR);
});

test("get", async () => {
  const response = {
    Item: 1
  };
  const get = jest.fn((payload, callback) => {
    callback(null, response);
  });
  const client = ({
    get
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    Key: {
      foo: faker.random.alphaNumeric()
    }
  };
  const result = await d.get(payload);
  expect(client.get).toBeCalledTimes(1);
  expect(get.mock.calls[0][0]).toEqual(payload);
  expect(result).toEqual(response);
});

test("get error", async () => {
  const get = jest.fn((payload, callback) => {
    callback(ERROR);
  });
  const client = ({
    get
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    Key: {
      foo: faker.random.alphaNumeric()
    }
  };
  await expect(d.get(payload)).rejects.toThrow(ERROR);
});

test("put", async () => {
  const response = {
    Item: 1
  };
  const put = jest.fn((payload, callback) => {
    callback(null, response);
  });
  const client = ({
    put
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    Item: {
      foo: faker.random.alphaNumeric()
    }
  };
  const result = await d.put(payload);
  expect(client.put).toBeCalledTimes(1);
  expect(put.mock.calls[0][0]).toEqual(payload);
  expect(result).toEqual(response);
});

test("put error", async () => {
  const put = jest.fn((payload, callback) => {
    callback(ERROR);
  });
  const client = ({
    put
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    Item: {
      foo: faker.random.alphaNumeric()
    }
  };
  await expect(d.put(payload)).rejects.toThrow(ERROR);
});

test("update", async () => {
  const response = {
    Item: 1
  };
  const update = jest.fn((payload, callback) => {
    callback(null, response);
  });
  const client = ({
    update
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    Key: {
      foo: faker.random.alphaNumeric()
    }
  };
  const result = await d.update(payload);
  expect(client.update).toBeCalledTimes(1);
  expect(update.mock.calls[0][0]).toEqual(payload);
  expect(result).toEqual(response);
});

test("update error", async () => {
  const update = jest.fn((payload, callback) => {
    callback(ERROR);
  });
  const client = ({
    update
  } as unknown) as AWS.DynamoDB.DocumentClient;
  const d = new DynamoService(client);
  const payload = {
    TableName: faker.random.alphaNumeric(),
    Key: {
      foo: faker.random.alphaNumeric()
    }
  };
  await expect(d.update(payload)).rejects.toThrow(ERROR);
});
