import { EthereumService } from "../ethereum.service";
import { Scraper } from "./scraper.interface";
import { AragonScraper } from "./aragon.scraper";
import * as _ from "lodash";
import { DynamoService } from "../dynamo.service";

export class ScrapingService {
  private readonly scrapers: Scraper[];

  constructor(readonly ethereum: EthereumService, readonly dynamo: DynamoService) {
    this.scrapers = [new AragonScraper(this.ethereum.web3, dynamo)];
  }

  async fromBlock(id: number) {
    const block = await this.ethereum.extendedBlock(id);
    const scraped = await Promise.all(this.scrapers.map(scraper => scraper.fromBlock(block)));
    return _.flatten(scraped);
  }
}
