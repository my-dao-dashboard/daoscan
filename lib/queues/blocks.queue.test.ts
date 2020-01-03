import { BlocksQueue } from "./blocks.queue";
import { IQueueService } from "./queue.service";
import { IEnvService } from "../services/env.service";
import faker from "faker";

const sendBatch = jest.fn();
const send = jest.fn();

const QUEUE_NAME = faker.random.alphaNumeric();

const queueService: IQueueService = {
  sendBatch: sendBatch,
  send: send
};

const env: IEnvService = {
  readString: jest.fn(() => QUEUE_NAME)
};

test("send", async () => {
  const q = new BlocksQueue(queueService, env);
  const id = faker.random.number();
  await q.send(id);
  expect(queueService.send).toBeCalledWith(QUEUE_NAME, { id });
});
