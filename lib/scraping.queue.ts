import { FromEnv } from "./from-env";
import { OrganisationEvent } from "./organisation-events";
import { QueueService } from "./queue.service";

export class ScrapingQueue {
  private readonly queueName: string;

  constructor(private readonly queue: QueueService) {
    this.queueName = FromEnv.string("SCRAPING_SQS_URL");
  }

  async send(event: OrganisationEvent): Promise<void> {
    await this.queue.send(this.queueName, event);
  }
}
