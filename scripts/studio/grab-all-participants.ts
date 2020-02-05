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
import { OrganisationRepository } from "../../lib/storage/organisation.repository";
import { sleep } from "../../lib/shared/sleep";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const web3 = new Web3(new Web3.providers.HttpProvider("http://mainnet.eth.daoscan.net"));

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

async function main() {
  const organisationRepository = Container.get(OrganisationRepository);
  const organisations = await organisationRepository.all();
  const addresses = organisations.map(org => org.address.toLowerCase());
  for (let index = 0; index < addresses.length; index++) {
    const address = addresses[index];
    const applicationRepository = Container.get(ApplicationRepository);
    const shareTokenAddress = await applicationRepository.tokenAddress(address);
    if (shareTokenAddress && shareTokenAddress !== '0x0000000000000000000000000000000000000000') {
      const shareToken = new web3.eth.Contract(ERC20_TOKEN_ABI as AbiItem[], shareTokenAddress);
      const events = await shareToken.getPastEvents("allEvents", {
        fromBlock: 0,
        toBlock: "latest",
        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
      });
      const blockNumbers = _.uniq(events.map(event => Number(event.blockNumber)));
      await Promise.all(
        blockNumbers.map(async n => {
          const response = await axios.post("https://api.daoscan.net/block", {
            id: n
          });
          console.log(JSON.stringify(response.data, null, 4));
        })
      );
      await sleep(1000);
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
