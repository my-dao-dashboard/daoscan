import { Container } from "typedi";
import { MigrationUpScenario } from "../util/migration-up.scenario";

export function migrateUp() {
  const migrationUpScenario = Container.get(MigrationUpScenario);
  migrationUpScenario
    .execute()
    .then(migrations => {
      console.log("Migrated");
      console.log(migrations);
    })
    .catch(error => {
      console.error("Can not migrate up");
      console.error(error);
    });
}
