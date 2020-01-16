import { RepositoryFactory } from "./repository.factory";
import { ConnectionFactory } from "./connection.factory";
import { EthereumBlockRow } from "./ethereum-block.row";
import faker from "faker";

const mockRepository = faker.random.word();
const mockGetRepository = jest.fn(() => mockRepository);
const mockConnection = {
  getRepository: mockGetRepository
};

test("reading", async () => {
  const mockReading = jest.fn(async () => mockConnection);
  const mockConnectionFactory = ({
    reading: mockReading
  } as unknown) as ConnectionFactory;
  const repositoryFactory = new RepositoryFactory(mockConnectionFactory);
  const repository = await repositoryFactory.reading(EthereumBlockRow);
  expect(repository).toEqual(mockRepository);
  expect(mockGetRepository).toBeCalledWith(EthereumBlockRow);
});

test("writing", async () => {
  const mockWriting = jest.fn(async () => mockConnection);
  const mockConnectionFactory = ({
    writing: mockWriting
  } as unknown) as ConnectionFactory;
  const repositoryFactory = new RepositoryFactory(mockConnectionFactory);
  const repository = await repositoryFactory.writing(EthereumBlockRow);
  expect(repository).toEqual(mockRepository);
  expect(mockGetRepository).toBeCalledWith(EthereumBlockRow);
});
