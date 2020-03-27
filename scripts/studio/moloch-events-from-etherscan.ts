import axios from "axios";
import axiosRetry from "axios-retry";
import * as csv from "csv-writer";
import { MOLOCH_1_ABI } from "../../lib/scraping/moloch-1/moloch-1.abi";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

axiosRetry(axios, { retries: 10, retryCondition: () => true, retryDelay: (retryCount, error) => retryCount * 1000 });

const writer = csv.createObjectCsvWriter({
  path: path.normalize("~/Desktop/a.csv"),
  header: [
    { id: "txid", title: "txid" },
    { id: "block", title: "block" },
    { id: "event", title: "event" }
  ]
});

function eventNameFromTopic(topic: string, txid: string) {
  switch (topic) {
    case "0x03995a801b13c36325306deef859ef977ce61c6e15a794281bf969d204825227":
      return "SummonComplete";
    case "0x2d105ebbc222c190059b3979356e13469f6a29a350add74ac3bf4f22f16301d6":
      return "SubmitProposal";
    case "0x29bf0061f2faa9daa482f061b116195432d435536d8af4ae6b3c5dd78223679b":
      return "SubmitVote";
    case "0x3f6fc303a82367bb4947244ba21c569a5ed2e870610f1a693366142309d7cbea":
      return "ProcessProposal";
    case "0xde7b64a369e10562cc2e71f0f1f944eaf144b75fead6ecb51fac9c4dd6934885":
      return "UpdateDelegateKey";
    case "0xa749dd3df92cae4d106b3eadf60c0dffd3698de09c67ce58ce6f5d02eb821313":
      return "Abort";
    case "0x667cb7a1818eacd2e3a421e734429ba9c4c7dec85e578e098b6d72cd2bfbf2f6":
      return "Ragequit";
    default:
      throw new Error(`Unknown topic ${topic} for txid ${txid}`);
  }
}

function eventParams(eventName: string, entry: any) {
  const abi = MOLOCH_1_ABI.find(item => item.name === eventName && item.type === "event");
}

async function main() {
  const response = await axios.get(
    "https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=7218566&toBlock=latest&address=0x1fd169a4f5c59acf79d0fd5d91d1201ef1bce9f1&apikey=H9UYS344NDYVSRAIPM9U47ZWR7327EUGDT"
  );
  const data = response.data;
  const entries = data.result;
  let n = 0;
  for (let entry of entries) {
    await writer.writeRecords([
      {
        txid: entry.transactionHash,
        block: parseInt(entry.blockNumber, 16),
        event: eventNameFromTopic(entry.topics[0], entry.transactionHash)
      }
    ]);
    n = n + 1;
    console.log(`Done with ${n} out of ${entries.length}`);
  }
}

main();
