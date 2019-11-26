import { notFound, ok } from "../lib/response";
import { ScrapingService } from "../lib/scraping/scraping.service";
import { EthereumService } from "../lib/ethereum.service";
import AWS from "aws-sdk";
import { DynamoService } from "../lib/dynamo.service";
import { TOKEN_ABI, TOKEN_CONTROLLER_ABI } from "../lib/scraping/aragon.constants";

const SQS_URL = String(process.env.SQS_URL);
const INFURA_PROJECT_ID = String(process.env.INFURA_PROJECT_ID);
const APPLICATIONS_TABLE = String(process.env.APPLICATIONS_TABLE);

const ethereum = new EthereumService(INFURA_PROJECT_ID);
const scraping = new ScrapingService(ethereum);
const dynamo = new DynamoService();

export async function block(event: any, context: any) {
  const data = JSON.parse(event.body);
  const id = Number(data.id);

  const events = await scraping.fromBlock(id);

  const sqs = new AWS.SQS();
  const sendings = events.map(e => {
    return new Promise((resolve, reject) => {
      const message = {
        QueueUrl: SQS_URL,
        MessageBody: JSON.stringify(e)
      };
      sqs.sendMessage(message, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  });

  await Promise.all(sendings);

  return ok({
    length: events.length,
    events: events
  });
}

export async function updateParticipants(event: any, context: any) {
  const data = JSON.parse(event.body);
  const organisationAddress = data.organisationAddress;
  const tokenApplication = await dynamo.get({
    TableName: APPLICATIONS_TABLE,
    ProjectionExpression: "proxyAddress",
    Key: {
      organisationAddress: organisationAddress,
      appId: "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f"
    }
  });
  if (tokenApplication.Item) {
    const tokenControllerAddress = tokenApplication.Item.proxyAddress as string;
    const tokenController = new ethereum.web3.eth.Contract(TOKEN_CONTROLLER_ABI, tokenControllerAddress);
    const tokenAddress = await tokenController.methods.token().call();
    const token = new ethereum.web3.eth.Contract(TOKEN_ABI, tokenAddress);
    const transferEvents = await token.getPastEvents("Transfer", { fromBlock: 0, toBlock: "latest" });

    return ok({
      addr: organisationAddress,
      tokenAddress,
      transferEvents
    });
  } else {
    return notFound();
  }
}
