import axios from "axios";
import axiosRetry from "axios-retry";
import _ from "lodash";

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const ENDPOINT = "https://api.daoscan.net/block";

const START_BLOCK = 9373013;
const END_BLOCK = 9_423_093;
const PAGE = 30;

async function main() {
  const pages = _.range(START_BLOCK, END_BLOCK, PAGE);
  for await (let page of pages) {
    const before = new Date();
    const promises = _.times(PAGE).map(async i => {
      const blockNumber = page + i;
      await axios.post(ENDPOINT, {
        id: blockNumber
      });
    });
    await Promise.all(promises);
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
