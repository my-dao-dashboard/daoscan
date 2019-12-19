import { ENV, FromEnv } from "../shared/from-env";
import { QueueService } from "./queue.service";
import { Service, Inject } from "typedi";

@Service()
export class BlocksQueue {
  private readonly queueName: string;

  constructor(@Inject(type => QueueService) private readonly queue: QueueService) {
    this.queueName = FromEnv.readString(ENV.BLOCKS_SQS_URL);
  }

  async send(id: number): Promise<void> {
    await this.queue.send(this.queueName, {
      id
    });
  }
}
