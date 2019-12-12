import axios from "axios";
import axiosRetry from "axios-retry";
import * as _ from "lodash";

axiosRetry(axios, { retries: 3 });
import * as fs from "fs";

const aa = JSON.parse(fs.readFileSync("./all-orgs.json").toString());

const addresses = aa.items.map((e: any) => e.address);

const STEP = 10

async function main() {
  for (let i = 400; i < addresses.length; i = i + STEP) {
    const promises = _.times(STEP).map(async j => {
      if (addresses[i + j]) {
        try {
          const result = await axios.post("https://j8vgijzngc.execute-api.us-east-1.amazonaws.com/dev/parse-participants", {
            organisationAddress: addresses[i + j]
          });
          console.log(`Parsing ${i + j}: ${addresses[i + j]}`)
        } catch (e) {
          if (e.response.status === 404) {
            console.log(`Have no token: ${addresses[i + j]}`)
          } else {
            throw e
          }
        }
      }
    });
    await Promise.all(promises);
    console.log(`Done ${i} out of ${addresses.length}`);
  }
}

main();
