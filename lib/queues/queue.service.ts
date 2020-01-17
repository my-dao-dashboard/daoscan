import { SQS } from "aws-sdk";
import * as _ from "lodash";
import { Inject, Service } from "typedi";
import { EnvService } from "../services/env.service";

export interface IQueueService {
  sendBatch(queueUrl: string, payloads: any[]): Promise<void>;
  send(queueUrl: string, payload: any): Promise<void>;
}

@Service(QueueService.name)
export class QueueService implements IQueueService {
  constructor(@Inject(EnvService.name) private readonly env: EnvService, private readonly sqs: SQS = new SQS()) {}

  async sendBatch(queueUrl: string, payloads: any[]): Promise<void> {
    if (payloads.length) {
      const batches = _.chunk(payloads, 10).map(async p => {
        await this.sendChunk(queueUrl, p);
      });
      await Promise.all(batches);
    }
  }

  private async sendChunk(queueUrl: string, payloads: any[]): Promise<void> {
    const entries = payloads.map<SQS.Types.SendMessageBatchRequestEntry>((p, i) => {
      return {
        Id: i.toString(),
        MessageBody: JSON.stringify(p)
      };
    });
    const message: SQS.Types.SendMessageBatchRequest = {
      QueueUrl: queueUrl,
      Entries: entries
    };
    console.debug(`Posting chunked messages to queue ${queueUrl}`, message);
    if (this.env.canQueue) {
      return new Promise((resolve, reject) => {
        this.sqs.sendMessageBatch(message, error => {
          error ? reject(error) : resolve();
        });
      });
    }
  }

  async send(queueUrl: string, payload: any): Promise<void> {
    const message: SQS.Types.SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload)
    };
    console.debug(`Posting message to queue ${queueUrl}`, message);
    if (this.env.canQueue) {
      return new Promise((resolve, reject) => {
        this.sqs.sendMessage(message, error => {
          error ? reject(error) : resolve();
        });
      });
    }
  }
}
