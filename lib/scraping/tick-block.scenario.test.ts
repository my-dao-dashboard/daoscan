import { TickBlockScenario } from "./tick-block.scenario";
import { EthereumService } from "../services/ethereum.service";
import { EthereumBlockRowRepository } from "../rel-storage/ethereum-block-row.repository";
import { BlocksQueue } from "../queues/blocks.queue";
import _ from "lodash";
import faker from "faker";

test("recentBlockNumbers", async () => {
  const latestBlockNumber = 55;
  const latestBlockNumberFunc = jest.fn(() => latestBlockNumber);
  const ethereumService = ({
    latestBlockNumber: latestBlockNumberFunc
  } as unknown) as EthereumService;
  const ethereumBlockRowRepository = ({} as unknown) as EthereumBlockRowRepository;
  const blocksQueue = ({} as unknown) as BlocksQueue;
  const scenario = new TickBlockScenario(ethereumService, ethereumBlockRowRepository, blocksQueue);
  const blockNumbers = await scenario.recentBlockNumbers();
  expect(blockNumbers).toEqual(_.times(20).map(i => latestBlockNumber - i));
  expect(latestBlockNumberFunc).toBeCalled();
});

test("isBlockParsed", async () => {
  const expected = faker.random.boolean();
  const id = faker.random.number();
  const ethereumService = ({} as unknown) as EthereumService;
  const isPresentFunc = jest.fn().mockReturnValue(expected);
  const ethereumBlockRowRepository = ({ isPresent: isPresentFunc } as unknown) as EthereumBlockRowRepository;
  const blocksQueue = ({} as unknown) as BlocksQueue;
  const scenario = new TickBlockScenario(ethereumService, ethereumBlockRowRepository, blocksQueue);
  const isPresent = await scenario.isBlockParsed(id);
  expect(isPresent).toEqual(expected);
});

test("queueBlock", async () => {
  const id = faker.random.number();
  const ethereumService = ({} as unknown) as EthereumService;
  const ethereumBlockRowRepository = ({} as unknown) as EthereumBlockRowRepository;
  const sendFunc = jest.fn();
  const blocksQueue = ({ send: sendFunc } as unknown) as BlocksQueue;
  const scenario = new TickBlockScenario(ethereumService, ethereumBlockRowRepository, blocksQueue);
  await scenario.queueBlock(id);
  expect(sendFunc).toBeCalledWith(id);
});

test("execute", async () => {
  const recentBlockNumbers = [1, 2, 3];
  const ethereumService = ({} as unknown) as EthereumService;
  const ethereumBlockRowRepository = ({} as unknown) as EthereumBlockRowRepository;
  const blocksQueue = ({} as unknown) as BlocksQueue;
  const scenario = new TickBlockScenario(ethereumService, ethereumBlockRowRepository, blocksQueue);
  scenario.recentBlockNumbers = jest.fn().mockReturnValue(recentBlockNumbers);
  scenario.isBlockParsed = jest.fn(async n => n === recentBlockNumbers[0]);
  const sendFunc = jest.fn();
  scenario.queueBlock = sendFunc;
  await scenario.execute();
  expect(sendFunc).not.toBeCalledWith(recentBlockNumbers[0]);
  expect(sendFunc).toBeCalledWith(recentBlockNumbers[1]);
  expect(sendFunc).toBeCalledWith(recentBlockNumbers[2]);
});
