import { ParseBlockScenario } from "./parse-block.scenario";
import { EthereumService } from "../services/ethereum.service";
import { ApplicationsRepository } from "../storage/applications.repository";
import { ScrapingQueue } from "../queues/scraping.queue";
import { EthereumBlockRowRepository } from "../rel-storage/ethereum-block-row.repository";
import faker from "faker";

test("extendedBlock", async () => {
  const fakeBlock = faker.random.words();
  const extendedBlockFunc = jest.fn().mockReturnValue(fakeBlock);
  const ethereumService = ({ extendedBlock: extendedBlockFunc } as unknown) as EthereumService;
  const applicationsRepository = ({} as unknown) as ApplicationsRepository;
  const scrapingQueue = ({} as unknown) as ScrapingQueue;
  const ethereumBlockRowRepository = ({} as unknown) as EthereumBlockRowRepository;
  const scenario = new ParseBlockScenario(
    ethereumService,
    applicationsRepository,
    scrapingQueue,
    ethereumBlockRowRepository
  );
  const blockNumber = faker.random.number();
  const block = await scenario.extendedBlock(blockNumber);
  expect(block).toEqual(fakeBlock);
  expect(extendedBlockFunc).toBeCalledWith(blockNumber);
});
