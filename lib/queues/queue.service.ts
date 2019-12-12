import { SQS } from "aws-sdk";
import * as _ from "lodash";

export class QueueService {
  private readonly sqs: SQS;

  constructor() {
    this.sqs = new SQS();
  }

  async sendBatch(queueUrl: string, payloads: any[]): Promise<void> {
    if (payloads.length) {
      const batches = _.chunk(payloads, 10).map(async p => {
        await this.sendBatchInternal(queueUrl, p);
      });
      await Promise.all(batches);
    }
  }

  private async sendBatchInternal(queueUrl: string, payloads: any[]): Promise<void> {
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
    console.log(`Posting message to queue ${queueUrl}`, message);
    return new Promise((resolve, reject) => {
      this.sqs.sendMessageBatch(message, error => {
        error ? reject(error) : resolve();
      });
    });
  }

  send(queueUrl: string, payload: any): Promise<SQS.SendMessageResult> {
    const message: SQS.Types.SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload)
    };
    return new Promise((resolve, reject) => {
      this.sqs.sendMessage(message, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  }
}
