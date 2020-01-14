import { EnvService } from "../services/env.service";
import { ENV } from "../shared/env";
import { ConnectionFactory, CreateConnectionFunction } from "./connection.factory";
import faker from "faker";
import path from "path";
import * as migrations from './migrations'

const READ_URL = faker.internet.url();
const WRITE_URL = faker.internet.url();

const env: EnvService = {
  readString: jest.fn((env: ENV) => {
    switch (env) {
      case ENV.WRITE_DATABASE_URL:
        return WRITE_URL;
      case ENV.READ_DATABASE_URL:
        return READ_URL;
      default:
        throw new Error("Not supported here");
    }
  })
};

test("reading", async () => {
  const connectionFactory = new ConnectionFactory(env);
  const connectionStub = faker.random.word();
  const createConnection = (jest.fn(async () => connectionStub) as unknown) as CreateConnectionFunction;
  const connection = await connectionFactory.reading(createConnection);
  expect(connection).toEqual(connectionStub);
  expect(createConnection).toBeCalledWith({
    name: "reading",
    type: "postgres",
    url: READ_URL,
    migrationsRun: false
  });
});

test("writing", async () => {
  const connectionFactory = new ConnectionFactory(env);
  const connectionStub = faker.random.word();
  const createConnection = (jest.fn(async () => connectionStub) as unknown) as CreateConnectionFunction;
  const connection = await connectionFactory.writing(createConnection);
  expect(connection).toEqual(connectionStub);
  expect(createConnection).toBeCalledWith({
    name: "writing",
    type: "postgres",
    url: WRITE_URL,
    migrationsRun: true,
    migrations: Object.values(migrations),
    entities: [`${path.join(__dirname, "./*.entity.{ts,js}")}`],
    logging: true
  });
});
