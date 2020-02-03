import "reflect-metadata";

import { Container } from "typedi";
import { BlockController } from "../lib/scraping/block.controller";
import { CommandController } from "../lib/scraping/command.controller";

import { migrateUp } from "../lib/shared/migrate-up";

migrateUp();

const blockController = Container.get(BlockController);
const commandController = Container.get(CommandController);

export const blockTick = blockController.tick;
export const blockAdd = blockController.add;
export const blockMassAdd = blockController.massAdd;

export const commandHandle = commandController.handle;
