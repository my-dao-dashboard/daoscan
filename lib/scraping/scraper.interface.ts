import { ExtendedBlock } from "../services/ethereum.service";
import { OrganisationEvent } from "../shared/organisation-events";

export interface Scraper {
  fromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]>;
}
