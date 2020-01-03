import { SQS } from "aws-sdk";
import * as _ from "lodash";
import { Service } from "typedi";

export interface IQueueService {
  sendBatch(queueUrl: string, payloads: any[]): Promise<void>;
  send(queueUrl: string, payload: any): Promise<void>;
}

@Service()
export class QueueService implements IQueueService {
  constructor(private readonly sqs: SQS = new SQS()) {}

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
    console.debug(`Posting message to queue ${queueUrl}`, message);
    return new Promise((resolve, reject) => {
      this.sqs.sendMessageBatch(message, error => {
        error ? reject(error) : resolve();
      });
    });
  }

  send(queueUrl: string, payload: any): Promise<void> {
    const message: SQS.Types.SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload)
    };
    return new Promise((resolve, reject) => {
      this.sqs.sendMessage(message, error => {
        error ? reject(error) : resolve();
      });
    });
  }
}
