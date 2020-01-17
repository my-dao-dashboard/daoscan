import { Container } from "typedi";
import { httpHandler } from "../lib/shared/http-handler";
import { MigrationController } from "../lib/util/migration.controller";

const controller = Container.get(MigrationController);

export const upMigration = httpHandler(controller.up);
