import path from "path";
import fs from "fs";
import axios from "axios";
import _ from "lodash";
import axiosRetry from "axios-retry";
import {sleep} from "../../lib/shared/sleep";

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const listFilename = path.resolve(__dirname, "orgs.json");
const listString = fs.readFileSync(listFilename).toString();
const raw = JSON.parse(listString);
const list = raw.data.organisations.nodes;
const addresses = list.map((l: any) => l.address);

async function grabBlocks(address: string) {
  console.log(address);
  const result = await axios.get(
    `http://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=10000000&sort=asc`
  );
  const txs = result.data.result;
  const blockNumbers = _.uniq(txs.map((tx: any) => Number(tx.blockNumber)));
  console.log(blockNumbers);
  return blockNumbers;
}

async function parseOrg(address: string) {
  const blockNumbers = (await grabBlocks(address))
  await Promise.all(
    blockNumbers.map(async n => {
      await axios.post("https://api.daoscan.net/block", {
        id: n
      });
    })
  );
  await sleep(1000);
}

async function main() {
  for (let index = 0; index < addresses.length; index++) {
    const before = new Date();
    const address = addresses[index];
    await parseOrg(address);
    const after = new Date();
    const delta = after.valueOf() - before.valueOf();
    const seconds = Math.floor(delta / 1000);
    const etaHours = ((((addresses.length - index)) * seconds) / 3600).toFixed(1);
    console.log(`Done with ${index}: ${address.toLowerCase()}, ETA ${etaHours}h`);
  }
}

main()
  .then(() => {
    // Do Nothing
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
