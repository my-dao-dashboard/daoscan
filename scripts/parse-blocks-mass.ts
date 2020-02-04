import axios from "axios";
import axiosRetry from "axios-retry";
import _ from "lodash";

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const ENDPOINT = "https://api.daoscan.net/block/mass";

const START_BLOCK = 8000000;
const END_BLOCK = 9_000_000;
const PAGE = 1000;

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
    const before = new Date();
    await axios.post(ENDPOINT, {
      start: page,
      finish: page + PAGE
    })
    const after = new Date();
    const delta = after.valueOf() - before.valueOf();
    const seconds = Math.floor(delta / 1000);
    const etaHours = ((((END_BLOCK - page) / PAGE) * seconds) / 3600).toFixed(1);
    console.log(`Done with ${page} in ${seconds}s, eta ${etaHours} h`);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
  });
