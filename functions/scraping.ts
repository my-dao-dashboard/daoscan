import "reflect-metadata";

import { Container } from "typedi";
import { BlockController } from "../lib/scraping/block.controller";
import { CommandController } from "../lib/scraping/command.controller";

const blockController = Container.get(BlockController);
const commandController = Container.get(CommandController);

export const tickBlock = blockController.tick;
export const addBlock = blockController.add;
export const handleCommand = commandController.handle;
