import { SQS } from "aws-sdk";

export class QueueService {
  private readonly sqs: SQS;

  constructor() {
    this.sqs = new SQS();
  }

  send(queueName: string, payload: any): Promise<SQS.SendMessageResult> {
    return new Promise((resolve, reject) => {
      const message: SQS.Types.SendMessageRequest = {
        QueueUrl: queueName,
        MessageBody: JSON.stringify(payload)
      };
      this.sqs.sendMessage(message, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  }
}
