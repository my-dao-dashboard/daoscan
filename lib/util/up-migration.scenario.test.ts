import { UpMigrationScenario } from "./up-migration.scenario";
import { ConnectionFactory } from "../rel-storage/connection.factory";
import faker from "faker";

const runMigrations = jest.fn();
const MIGRATION_NAMES = faker.random.words(10).split(" ");
const writingConnection = {
  runMigrations,
  migrations: MIGRATION_NAMES.map<{ name: string | undefined }>(w => {
    return { name: w };
  }).concat({ name: undefined })
};
const connectionFactory = ({
  writing: jest.fn().mockReturnValue(writingConnection)
} as unknown) as ConnectionFactory;

test("execute", async () => {
  const scenario = new UpMigrationScenario(connectionFactory);
  const migrations = await scenario.execute();
  expect(migrations).toEqual(MIGRATION_NAMES.concat(""));
  expect(runMigrations).toBeCalledTimes(1);
});
