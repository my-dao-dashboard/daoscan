import { ok } from "../lib/response";
import { ScrapingService } from "../lib/scraping/scraping.service";
import { EthereumService } from "../lib/ethereum.service";
import AWS from "aws-sdk";

const SQS_URL = String(process.env.SQS_URL);
const INFURA_PROJECT_ID = String(process.env.INFURA_PROJECT_ID);

const ethereum = new EthereumService(INFURA_PROJECT_ID);
const scraping = new ScrapingService(ethereum);

export async function block(event: any, context: any) {
  const data = JSON.parse(event.body);
  const id = Number(data.id);

  const events = await scraping.fromBlock(id);

  const sqs = new AWS.SQS();
  const sendings = events.map(e => {
    return new Promise((resolve, reject) => {
      const message = {
        QueueUrl: SQS_URL,
        MessageBody: JSON.stringify(e)
      };
      sqs.sendMessage(message, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  });

  await Promise.all(sendings);

  return ok({
    length: events.length,
    events: events
  });
}
