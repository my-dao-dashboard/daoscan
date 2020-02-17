import "reflect-metadata";
import { Container } from "typedi";
import { EthereumService } from "../../lib/services/ethereum.service";
import { MOLOCH_1_ABI } from "../../lib/scraping/moloch-1/moloch-1.abi";
import dotenv from "dotenv";
import path from "path";
import _ from "lodash";
import axiosRetry from "axios-retry";
import axios from "axios";

dotenv.config({ path: path.resolve(__dirname, ".env") });
axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const ethereum = Container.get(EthereumService);

async function main() {
  const moloch = ethereum.contract(MOLOCH_1_ABI, "0x1fd169A4f5c59ACf79d0Fd5d91D1201EF1Bce9f1");
  const events = await moloch.getPastEvents("allEvents", { fromBlock: 7218566, toBlock: "latest" });
  const allBlocks = events.map(e => e.blockNumber);
  const blocks = _.sortedUniq(allBlocks);
  for (let b of blocks) {
    await axios.post("http://localhost:3000/block?inplace=true", {
      id: b
    });
  }
}

main()
  .then(() => {
    // Do Nothing
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
