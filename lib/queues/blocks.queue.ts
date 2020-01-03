import { IQueueService, QueueService } from "./queue.service";
import { Service, Inject } from "typedi";
import { EnvService } from "../services/env.service";
import { ENV } from "../shared/env";

@Service()
export class BlocksQueue {
  private readonly queueName: string;

  constructor(
    @Inject(type => QueueService) private readonly queue: IQueueService,
    @Inject(type => EnvService) env: EnvService
  ) {
    this.queueName = env.readString(ENV.BLOCKS_SQS_URL);
  }

  async send(id: number): Promise<void> {
    await this.queue.send(this.queueName, {
      id
    });
  }
}
