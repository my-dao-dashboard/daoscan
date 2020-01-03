import { QueueService } from "./queue.service";
import * as _ from "lodash";
import { SQS } from "aws-sdk";

const sendMessage = jest.fn((message, callback) => {
  callback(null);
});

const sendMessageBatch = jest.fn((messages, callback) => {
  callback(null);
});

const SQSMocked = {
  sendMessage: sendMessage,
  sendMessageBatch: sendMessageBatch
};

jest.mock("aws-sdk", () => {
  return {
    SQS: jest.fn(() => SQSMocked)
  };
});

beforeEach(() => {
  SQSMocked.sendMessage = sendMessage;
  SQSMocked.sendMessageBatch = sendMessageBatch;
  SQSMocked.sendMessage.mockClear();
  SQSMocked.sendMessageBatch.mockClear();
});

const QUEUE_URL = "foo";

test("constructor", async () => {
  const sqs = SQSMocked as unknown;
  const queueService = new QueueService(sqs as SQS);
  const message = { foo: "hello" };
  await queueService.send(QUEUE_URL, message);
  expect((sqs as any).sendMessage).toBeCalledTimes(1);
});

describe("send", () => {
  test("send object", async () => {
    const queueService = new QueueService();
    const message = { foo: "hello" };
    await queueService.send(QUEUE_URL, message);
    expect(SQSMocked.sendMessage).toBeCalledTimes(1);
    expect(SQSMocked.sendMessage.mock.calls[0][0]).toEqual({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message)
    });
  });

  test("send rejected", async () => {
    const queueService = new QueueService();
    const message = { foo: "hello" };
    const error = new Error("Oops");
    SQSMocked.sendMessage = jest.fn((message, callback) => {
      callback(error);
    });
    await expect(queueService.send(QUEUE_URL, message)).rejects.toThrow(error);
  });
});

describe("sendBatch", () => {
  test("send no", async () => {
    const times = 0;
    const queueService = new QueueService();
    const messages = _.times(times).map(() => ({ foo: "hello" }));
    await queueService.sendBatch(QUEUE_URL, messages);
    expect(SQSMocked.sendMessageBatch).toBeCalledTimes(0);
  });

  test("send few", async () => {
    const times = 5;
    const queueService = new QueueService();
    const messages = _.times(times).map(() => ({ foo: "hello" }));
    await queueService.sendBatch(QUEUE_URL, messages);
    expect(SQSMocked.sendMessageBatch).toBeCalledTimes(1);
    expect(SQSMocked.sendMessageBatch.mock.calls[0][0]).toEqual({
      QueueUrl: QUEUE_URL,
      Entries: messages.map((m, i) => {
        return { Id: i.toString(), MessageBody: JSON.stringify(m) };
      })
    });
  });

  test("reject", async () => {
    const times = 5;
    const queueService = new QueueService();
    const messages = _.times(times).map(() => ({ foo: "hello" }));
    const error = new Error("Oops");
    SQSMocked.sendMessageBatch = jest.fn((messages, callback) => {
      callback(error);
    });
    await expect(queueService.sendBatch(QUEUE_URL, messages)).rejects.toThrow(error);
  });

  test("send whole batch", async () => {
    const times = 15;
    const queueService = new QueueService();
    const messages = _.times(times).map(i => ({ foo: `hello, ${i}` }));
    await queueService.sendBatch(QUEUE_URL, messages);
    expect(SQSMocked.sendMessageBatch).toBeCalledTimes(2);
    expect(SQSMocked.sendMessageBatch.mock.calls[0][0]).toEqual({
      QueueUrl: QUEUE_URL,
      Entries: _.times(10).map(i => {
        return { Id: i.toString(), MessageBody: JSON.stringify({ foo: `hello, ${i}` }) };
      })
    });
    expect(SQSMocked.sendMessageBatch.mock.calls[1][0]).toEqual({
      QueueUrl: QUEUE_URL,
      Entries: _.times(5).map(i => {
        return { Id: i.toString(), MessageBody: JSON.stringify({ foo: `hello, ${i + 10}` }) };
      })
    });
  });
});
