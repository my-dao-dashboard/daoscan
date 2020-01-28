import axios from "axios";
import axiosRetry from "axios-retry";
import _ from "lodash";

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const START_BLOCK = 8405046; // 8403326;
const END_BLOCK = 8420626;
const PAGE = 20;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function main() {
  const pages = _.range(START_BLOCK, END_BLOCK, PAGE);
  for await (let page of pages) {
    const promises = _.times(PAGE).map(async i => {
      const blockNumber = page + i;
      await axios.post("https://alpha.daoscan.net/block", {
        id: blockNumber
      });
      await sleep(500);
    });
    await Promise.all(promises);
    console.log(`Done with ${page}`);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
  });
