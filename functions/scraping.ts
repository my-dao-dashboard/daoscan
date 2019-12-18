import { ScrapingContainer } from "../lib/scraping/scraping.container";
import { handler } from "../lib/shared/handler";

const scrapingContainer = new ScrapingContainer();

export const tickBlock = scrapingContainer.scrapingService.tickBlock;
export const parseBlock = scrapingContainer.scrapingController.parseBlock;
export const saveOrganisationEvent = scrapingContainer.scrapingController.saveOrganisationEvent;

export const parseParticipants = handler(scrapingContainer.scrapingController.parseParticipants);
export const readExtendedBlock = handler(scrapingContainer.scrapingController.readExtendedBlock);
