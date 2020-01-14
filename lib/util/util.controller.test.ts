import faker from "faker";
import { EnvService } from "../services/env.service";
import { NoBodyError, NoTokenError, UtilController } from "./util.controller";
import { UpMigrationScenario } from "./up-migration.scenario";
import { APIGatewayEvent } from "aws-lambda";
import { ForbiddenError } from "../shared/errors";

const UTIL_SECRET = faker.internet.url();
const MIGRATIONS = faker.random.words(10).split(" ");

const env: EnvService = {
  readString: jest.fn(() => UTIL_SECRET)
};

const upMigrationScenario = ({
  execute: jest.fn().mockReturnValue(MIGRATIONS)
} as unknown) as UpMigrationScenario;

let utilController: UtilController;

beforeEach(() => {
  utilController = new UtilController(upMigrationScenario, env);
});

test("readSecret", () => {
  const event = {
    body: JSON.stringify({ token: UTIL_SECRET })
  } as APIGatewayEvent;
  const token = utilController.readSecret(event);
  expect(token).toEqual(UTIL_SECRET);
});

describe("ensureCorrectSecret", () => {
  test("ok", () => {
    const event = {
      body: JSON.stringify({ token: UTIL_SECRET })
    } as APIGatewayEvent;
    expect(() => utilController.ensureCorrectSecret(event)).not.toThrow();
  });

  test("no body", () => {
    const event = {
      body: null
    } as APIGatewayEvent;
    expect(() => utilController.ensureCorrectSecret(event)).toThrow(NoBodyError);
  });

  test("no token", () => {
    const event = {
      body: JSON.stringify({ token: null })
    } as APIGatewayEvent;
    expect(() => utilController.ensureCorrectSecret(event)).toThrow(NoTokenError);
  });

  test("invalid token", () => {
    const event = {
      body: JSON.stringify({ token: faker.random.word() })
    } as APIGatewayEvent;
    expect(() => utilController.ensureCorrectSecret(event)).toThrow(ForbiddenError);
  });
});

test("migrateUp", async () => {
  const event = {
    body: JSON.stringify({ token: UTIL_SECRET })
  } as APIGatewayEvent;
  const migrateUp = await utilController.migrateUp(event);
  expect(upMigrationScenario.execute).toBeCalled();
  expect(migrateUp).toEqual({ migrations: MIGRATIONS });
});
