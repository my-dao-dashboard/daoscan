import { BlocksQueue } from "./blocks.queue";
import { IQueueService } from "./queue.service";
import { IEnvService } from "../services/env.service";

const sendBatch = jest.fn();
const send = jest.fn();

const queueService: IQueueService = {
  sendBatch: sendBatch,
  send: send
};

const env: IEnvService = {
  readString: jest.fn(() => "foo")
};

test("send", async () => {
  const q = new BlocksQueue(queueService, env);
  await q.send(13);
  expect(queueService.send).toBeCalledWith("foo", { id: 13 });
});
