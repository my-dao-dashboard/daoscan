import { IQueueService, QueueService } from "../services/queue.service";
import { Service, Inject } from "typedi";
import { ENV, EnvService } from "../services/env.service";
import { BlockAddEvent } from "./block-add.event";

@Service(BlocksQueue.name)
export class BlocksQueue {
  private readonly queueName: string;

  constructor(
    @Inject(QueueService.name) private readonly queue: IQueueService,
    @Inject(EnvService.name) env: EnvService
  ) {
    this.queueName = env.readString(ENV.BLOCKS_SQS_URL);
  }

  async sendBatch(events: BlockAddEvent[]) {
    await this.queue.sendBatch(this.queueName, events);
  }
}
