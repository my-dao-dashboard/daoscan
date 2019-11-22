import { ok } from "../lib/response";
import { ScrapingService } from "../lib/scraping/scraping.service";
import { EthereumService } from "../lib/ethereum.service";

const INFURA_PROJECT_ID = String(process.env.INFURA_PROJECT_ID);

const ethereum = new EthereumService(INFURA_PROJECT_ID);
const scraping = new ScrapingService(ethereum);

export async function block(event: any, context: any) {
  const data = JSON.parse(event.body);
  const id = Number(data.id);

  const events = await scraping.fromBlock(id);

  return ok(events);
}
