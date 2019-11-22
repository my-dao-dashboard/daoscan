import { EthereumService } from "../ethereum.service";
import { IScraper } from "./scraper.interface";
import { AragonScraper } from "./aragon.scraper";
import * as _ from "lodash";

export class ScrapingService {
  private readonly scrapers: IScraper[];

  constructor(private readonly ethereum: EthereumService) {
    this.scrapers = [new AragonScraper(this.ethereum.web3)];
  }

  async fromBlock(id: number) {
    const block = await this.ethereum.extendedBlock(id);
    const scraped = await Promise.all(this.scrapers.map(scraper => scraper.fromBlock(block)));
    return _.flatten(scraped);
  }
}
