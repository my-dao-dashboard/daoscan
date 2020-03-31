import axios from "axios";
import axiosRetry from "axios-retry";
import dotenv from "dotenv";
import path from "path";
import Web3 from "web3";
import _ from "lodash";
import { AbiItem } from "web3-utils";
import { Container } from "typedi";
import { ApplicationRepository } from "../../lib/storage/application.repository";
import ERC20_TOKEN_ABI from "../../lib/querying/erc20-token.abi.json";
import { OrganisationStorage } from "../../lib/storage/organisation.storage";
import { sleep } from "../../lib/shared/sleep";
import { PLATFORM } from "../../lib/domain/platform";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/e201ebd046304d9d89a598b6c73baa8c"));

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const organisationRepository = Container.get(OrganisationStorage);
const applicationRepository = Container.get(ApplicationRepository);

async function main() {
  const organisations = await organisationRepository.all(PLATFORM.ARAGON);
  const addresses = organisations.map(org => org.address.toLowerCase());
  console.log("Got organisations", addresses.length);
  const start = 26;
  const stop = addresses.length;
  console.log(`Parsing from ${start} to ${stop}`);
  for (let index = start; index < stop; index++) {
    const address = addresses[index];
    const shareTokenAddress = await applicationRepository.tokenAddress(address);
    if (shareTokenAddress && shareTokenAddress !== "0x0000000000000000000000000000000000000000") {
      console.log("Got share token", shareTokenAddress);
      const shareToken = new web3.eth.Contract(ERC20_TOKEN_ABI as AbiItem[], shareTokenAddress);
      const events = await shareToken.getPastEvents("allEvents", {
        fromBlock: 0,
        toBlock: "latest",
        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
      });
      const blockNumbers = _.uniq(events.map(event => Number(event.blockNumber)));
      console.log("Posting block numbers", blockNumbers);
      let m = 0;
      for (let n of blockNumbers) {
        const response = await axios.post("https://api.daoscan.net/block", {
          id: n
        });
        console.log(`Done with ${m + 1} blocks out of ${blockNumbers.length}`);
        // console.log(JSON.stringify(response.data, null, 4));
        await sleep(500);
        m = m + 1;
      }
    }
    console.log(`Done with ${address}: ${index}/${addresses.length}`);
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
