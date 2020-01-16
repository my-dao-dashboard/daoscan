import { EthereumBlockRowRepository } from "./ethereum-block-row.repository";
import { RepositoryFactory } from "./repository.factory";
import faker from "faker";
import { EthereumBlockRow } from "./ethereum-block.row";

test("byId found", async () => {
  const expected = faker.random.word();
  const readingRepository = {
    findOne: jest.fn().mockReturnValue(expected)
  };
  const mockRepositoryFactory = ({
    reading: jest.fn().mockReturnValue(readingRepository)
  } as unknown) as RepositoryFactory;
  const repository = new EthereumBlockRowRepository(mockRepositoryFactory);
  const id = faker.random.number();
  const found = await repository.byId(id);
  expect(found).toEqual(expected);
  expect(mockRepositoryFactory.reading).toBeCalledWith(EthereumBlockRow);
  expect(readingRepository.findOne).toBeCalledWith({ id });
});

test("save", async () => {
  const blockRow = new EthereumBlockRow();
  blockRow.id = faker.random.number();
  blockRow.hash = faker.random.word();
  const expected = faker.random.word();
  const writingRepository = {
    save: jest.fn().mockReturnValue(expected)
  };
  const mockRepositoryFactory = ({
    writing: jest.fn().mockReturnValue(writingRepository)
  } as unknown) as RepositoryFactory;
  const repository = new EthereumBlockRowRepository(mockRepositoryFactory);
  const saved = await repository.save(blockRow);
  expect(saved).toEqual(expected);
  expect(mockRepositoryFactory.writing).toBeCalledWith(EthereumBlockRow);
  expect(writingRepository.save).toBeCalledWith(blockRow);
});

test("isPresent", async () => {
  const mockRepositoryFactory = ({} as unknown) as RepositoryFactory;
  const repository = new EthereumBlockRowRepository(mockRepositoryFactory);
  const isFound = faker.random.boolean();
  repository.byId = jest.fn().mockReturnValue(isFound);
  const id = faker.random.number();
  const found = await repository.isPresent(id);
  expect(found).toEqual(isFound);
  expect(repository.byId).toBeCalled();
});

test("markParsed", async () => {
  const id = faker.random.number();
  const hash = faker.random.word();
  const mockRepositoryFactory = ({} as unknown) as RepositoryFactory;
  const repository = new EthereumBlockRowRepository(mockRepositoryFactory);
  const saveFunc = jest.fn();
  repository.save = saveFunc;
  await repository.markParsed(id, hash);
  expect(saveFunc).toBeCalled();
  expect(saveFunc.mock.calls[0][0].id).toEqual(id);
  expect(saveFunc.mock.calls[0][0].hash).toEqual(hash);
});
