import {ExtendedBlock} from "../ethereum.service";
import {OrganisationEvent} from "../organisation";

export interface IScraper {
  fromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]>
}
