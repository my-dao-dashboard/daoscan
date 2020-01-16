import { EthereumBlockRow } from "./ethereum-block.row";
import faker from "faker";

test("setHashToLowerCase", () => {
  const block = new EthereumBlockRow();
  const hash = faker.random.word().toLowerCase();
  block.hash = hash.toUpperCase();
  (block as any).setHashToLowerCase();
  expect(block.hash).toEqual(hash);
});
