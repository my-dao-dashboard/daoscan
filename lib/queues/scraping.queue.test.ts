import { IQueueService } from "./queue.service";
import { ScrapingQueue } from "./scraping.queue";
import { IEnvService } from "../services/env.service";
import { ORGANISATION_EVENT, ORGANISATION_PLATFORM, OrganisationCreatedEvent } from "../organisation-events";
import faker from "faker";

const QUEUE_NAME = faker.random.alphaNumeric();

const sendBatch = jest.fn();
const send = jest.fn();

const queueService: IQueueService = {
  sendBatch: sendBatch,
  send: send
};

const env: IEnvService = {
  readString: jest.fn(() => QUEUE_NAME)
};

const event: OrganisationCreatedEvent = {
  kind: ORGANISATION_EVENT.CREATED,
  platform: ORGANISATION_PLATFORM.ARAGON,
  name: faker.random.alphaNumeric(),
  address: faker.random.alphaNumeric(),
  txid: faker.random.alphaNumeric(),
  blockNumber: faker.random.number(),
  timestamp: faker.random.number()
};

test("sendBatch", async () => {
  const scrapingQueue = new ScrapingQueue(queueService, env);
  await scrapingQueue.sendBatch([event]);
  expect(queueService.sendBatch).toBeCalledWith(QUEUE_NAME, [event]);
});

test("sendBatch", async () => {
  const scrapingQueue = new ScrapingQueue(queueService, env);
  await scrapingQueue.send(event);
  expect(queueService.send).toBeCalledWith(QUEUE_NAME, event);
});
