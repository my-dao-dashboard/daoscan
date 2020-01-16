import { Scenario } from "../shared/scenario.interface";
import { OrganisationEvent } from "../shared/organisation-events";
import { Inject, Service } from "typedi";
import { EthereumService, ExtendedBlock } from "../services/ethereum.service";
import * as _ from "lodash";
import { Scraper } from "./scraper.interface";
import { AragonScraper } from "./aragon.scraper";
import { ApplicationsRepository } from "../storage/applications.repository";
import { ScrapingQueue } from "../queues/scraping.queue";
import { EthereumBlockRowRepository } from "../rel-storage/ethereum-block-row.repository";
import { RevertBlockScenario } from "./revert-block.scenario";

@Service(AddBlockScenario.name)
export class AddBlockScenario implements Scenario<number, OrganisationEvent[]> {
  private readonly scrapers: Scraper[];

  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ApplicationsRepository.name) private readonly applicationsRepository: ApplicationsRepository,
    @Inject(ScrapingQueue.name) private readonly scrapingQueue: ScrapingQueue,
    @Inject(EthereumBlockRowRepository.name) private readonly ethereumBlockRowRepository: EthereumBlockRowRepository,
    @Inject(RevertBlockScenario.name) private readonly revertBlockScenario: RevertBlockScenario
  ) {
    this.scrapers = [new AragonScraper(this.ethereum.web3, applicationsRepository, this.ethereum)];
  }

  extendedBlock(id: number): Promise<ExtendedBlock> {
    return this.ethereum.extendedBlock(id);
  }

  async eventsFromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]> {
    const scraped = await Promise.all(this.scrapers.map(scraper => scraper.fromBlock(block)));
    return _.flatten(scraped);
  }

  async fanoutEvents(events: OrganisationEvent[]): Promise<void> {
    await this.scrapingQueue.sendBatch(events);
  }

  async markBlockParsed(block: ExtendedBlock) {
    await this.ethereumBlockRowRepository.markParsed(block.number, block.hash);
  }

  async execute(id: number): Promise<OrganisationEvent[]> {
    console.log(`Adding block #${id}...`);
    const block = await this.extendedBlock(id);
    const events = await this.eventsFromBlock(block);
    await this.fanoutEvents(events);
    await this.markBlockParsed(block);
    console.log(`Added block #${id}: events=${events.length}`);
    return events;
  }
}
