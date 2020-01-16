import "reflect-metadata";

import { Container } from "typedi";
import { httpHandler } from "../lib/shared/http-handler";
import { ScrapingController } from "../lib/scraping/scraping.controller";

const scrapingController = Container.get(ScrapingController);

export const tickBlock = scrapingController.tickBlock;
export const parseBlock = scrapingController.parseBlock;
export const saveOrganisationEvent = scrapingController.saveOrganisationEvent;

// export const parseParticipants = httpHandler(scrapingController.parseParticipants);
export const readExtendedBlock = httpHandler(scrapingController.readExtendedBlock);
