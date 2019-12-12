import { SQS } from "aws-sdk";

export class QueueService {
  private readonly sqs: SQS;

  constructor() {
    this.sqs = new SQS();
  }

  async sendBatch(queueUrl: string, payloads: any[]): Promise<void> {
    if (payloads.length) {
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
      console.log("Posting message", message);
      return new Promise((resolve, reject) => {
        this.sqs.sendMessageBatch(message, error => {
          error ? reject(error) : resolve();
        });
      });
    }
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
