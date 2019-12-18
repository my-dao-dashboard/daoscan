import { EthereumService } from "../ethereum.service";
import { DynamoService } from "../storage/dynamo.service";
import { ScrapingService } from "./scraping.service";
import { BlocksRepository } from "../storage/blocks.repository";
import { QueueService } from "../queues/queue.service";
import { ScrapingQueue } from "../queues/scraping.queue";
import { BlocksQueue } from "../queues/blocks.queue";
import { ApplicationsRepository } from "../storage/applications.repository";
import { ParticipantsRepository } from "../storage/participants.repository";
import { OrganisationsRepository } from "../storage/organisations.repository";

export class ScrapingContainer {
  public readonly ethereum = new EthereumService();
  public readonly dynamo = new DynamoService();
  public readonly scrapingService = new ScrapingService(this.ethereum, this.dynamo);
  public readonly blocksRepository = new BlocksRepository(this.dynamo);
  public readonly queueService = new QueueService();
  public readonly scrapingQueue = new ScrapingQueue(this.queueService);
  public readonly blocksQueue = new BlocksQueue(this.queueService);
  public readonly applicationsRepository = new ApplicationsRepository(this.dynamo);
  public readonly participantsRepository = new ParticipantsRepository(this.dynamo);
  public readonly organisationsRepository = new OrganisationsRepository(this.dynamo);
}
