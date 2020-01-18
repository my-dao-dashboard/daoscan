import { IQueueService, QueueService } from "../services/queue.service";
import { Service, Inject } from "typedi";
import { ENV, EnvService } from "../services/env.service";
import { Command } from "./command";

@Service(ScrapingQueue.name)
export class ScrapingQueue {
  private readonly queueName: string;

  constructor(
    @Inject(QueueService.name) private readonly queue: IQueueService,
    @Inject(EnvService.name) private readonly env: EnvService
  ) {
    this.queueName = env.readString(ENV.SCRAPING_SQS_URL);
  }

  sendBatch(events: Command[]): Promise<void> {
    return this.queue.sendBatch(this.queueName, events);
  }

  send(event: Command): Promise<void> {
    return this.queue.send(this.queueName, event);
  }
}
