import { OrganisationEvent } from "../shared/organisation-events";
import { IQueueService, QueueService } from "./queue.service";
import { Service, Inject } from "typedi";
import { ENV } from "../shared/env";
import { EnvService, IEnvService } from "../services/env.service";

@Service(ScrapingQueue.name)
export class ScrapingQueue {
  private readonly queueName: string;

  constructor(
    @Inject(QueueService.name) private readonly queue: IQueueService,
    @Inject(EnvService.name) private readonly env: IEnvService
  ) {
    this.queueName = env.readString(ENV.SCRAPING_SQS_URL);
  }

  sendBatch(events: OrganisationEvent[]): Promise<void> {
    return this.queue.sendBatch(this.queueName, events);
  }

  send(event: OrganisationEvent): Promise<void> {
    return this.queue.send(this.queueName, event);
  }
}
