import { IQueueService, QueueService } from "./queue.service";
import { Service, Inject } from "typedi";
import { EnvService, IEnvService } from "../services/env.service";
import { ENV } from "../shared/env";

@Service(BlocksQueue.name)
export class BlocksQueue {
  private readonly queueName: string;

  constructor(
    @Inject(QueueService.name) private readonly queue: IQueueService,
    @Inject(EnvService.name) env: IEnvService
  ) {
    this.queueName = env.readString(ENV.BLOCKS_SQS_URL);
  }

  async send(id: number): Promise<void> {
    await this.queue.send(this.queueName, {
      id
    });
  }
}
