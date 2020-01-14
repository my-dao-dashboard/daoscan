import { Container } from "typedi";
import { UtilController } from "../lib/util/util.controller";
import { httpHandler } from "../lib/shared/http-handler";

const controller = Container.get(UtilController);

export const migrateUp = httpHandler(controller.migrateUp);
