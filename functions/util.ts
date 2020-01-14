import { Container } from "typedi";
import { UtilController } from "../lib/util/util.controller";
import { handler } from "../lib/shared/handler";

const controller = Container.get(UtilController);

export const migrateUp = handler(controller.migrateUp);
