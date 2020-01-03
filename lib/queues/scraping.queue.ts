import { FromEnv } from "../shared/from-env";
import { OrganisationEvent } from "../organisation-events";
import { QueueService } from "./queue.service";
import { Service, Inject } from "typedi";
import { ENV } from "../shared/env";

@Service()
export class ScrapingQueue {
  private readonly queueName: string;

  constructor(@Inject(type => QueueService) private readonly queue: QueueService) {
    this.queueName = FromEnv.readString(ENV.SCRAPING_SQS_URL);
  }

  async sendBatch(events: OrganisationEvent[]): Promise<void> {
    await this.queue.sendBatch(this.queueName, events);
  }

  async send(event: OrganisationEvent): Promise<void> {
    await this.queue.send(this.queueName, event);
  }
}
