import "reflect-metadata";

import { Container } from "typedi";
import { handler } from "../lib/shared/handler";
import { ScrapingService } from "../lib/scraping/scraping.service";
import { ScrapingController } from "../lib/scraping/scraping.controller";

const scrapingService = Container.get(ScrapingService);
const scrapingController = Container.get(ScrapingController);

export const tickBlock = scrapingService.tickBlock;
export const parseBlock = scrapingController.parseBlock;
export const saveOrganisationEvent = scrapingController.saveOrganisationEvent;

export const parseParticipants = handler(scrapingController.parseParticipants);
export const readExtendedBlock = handler(scrapingController.readExtendedBlock);
