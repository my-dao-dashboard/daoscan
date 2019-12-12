import { FromEnv } from "./from-env";
import { QueueService } from "./queue.service";

export class BlocksQueue {
  private readonly queueName: string;

  constructor(private readonly queue: QueueService) {
    this.queueName = FromEnv.string("BLOCKS_SQS_URL");
  }

  async send(id: number): Promise<void> {
    await this.queue.send(this.queueName, {
      id
    });
  }
}
