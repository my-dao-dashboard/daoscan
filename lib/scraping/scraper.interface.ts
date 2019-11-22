import { ExtendedBlock } from "../ethereum.service";
import { OrganisationEvent } from "../organisation-events";

export interface Scraper {
  fromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]>;
}
