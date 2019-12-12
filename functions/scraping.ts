import { notFound, ok } from "../lib/response";
import { ScrapingService } from "../lib/scraping/scraping.service";
import { EthereumService } from "../lib/ethereum.service";
import AWS from "aws-sdk";
import { DynamoService } from "../lib/storage/dynamo.service";
import { TOKEN_ABI, TOKEN_CONTROLLER_ABI } from "../lib/scraping/aragon.constants";
import {
  AddParticipantEvent,
  AppInstalledEvent,
  ORGANISATION_EVENT,
  ORGANISATION_PLATFORM,
  OrganisationCreatedEvent,
  OrganisationEvent,
  ShareTransferEvent
} from "../lib/organisation-events";
import { UnreachableCaseError } from "../lib/unreachable-case-error";
import { BlocksRepository } from "../lib/storage/blocks.repository";

const BLOCKS_SQS_URL = String(process.env.BLOCKS_SQS_URL);
const SCRAPING_SQS_URL = String(process.env.SCRAPING_SQS_URL);

const INFURA_PROJECT_ID = String(process.env.INFURA_PROJECT_ID);

const APPLICATIONS_TABLE = String(process.env.APPLICATIONS_TABLE);
const PARTICIPANTS_TABLE = String(process.env.PARTICIPANTS_TABLE);
const ORGANISATIONS_TABLE = String(process.env.ORGANISATIONS_TABLE);

const ethereum = new EthereumService(INFURA_PROJECT_ID);
const dynamo = new DynamoService();
const scraping = new ScrapingService(ethereum, dynamo);
const sqs = new AWS.SQS();
const blocksRepository = new BlocksRepository(dynamo);

async function parseBlockImpl(body: any) {
  const data = JSON.parse(body);
  const id = Number(data.id);
  console.log(`Starting parsing block #${id}...`);
  const events = await scraping.fromBlock(id);

  const sendings = events.map(e => {
    return new Promise((resolve, reject) => {
      const message = {
        QueueUrl: SCRAPING_SQS_URL,
        MessageBody: JSON.stringify(e)
      };
      sqs.sendMessage(message, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  });
  await Promise.all(sendings);
  await blocksRepository.markParsed(id);
  console.log(`Parsed block #${id}: events=${events.length}`);
  return ok({
    events: events
  });
}

export async function tickBlock(event: any, context: any) {
  const block = await ethereum.block("latest");
  const latest = block.number;
  const previous = latest - 20;
  for (let i = previous; i <= latest; i++) {
    const isPresent = await blocksRepository.isPresent(i);
    if (!isPresent) {
      const sending = new Promise((resolve, reject) => {
        const message = {
          QueueUrl: BLOCKS_SQS_URL,
          MessageBody: JSON.stringify({ id: i })
        };
        sqs.sendMessage(message, (err, data) => {
          err ? reject(err) : resolve(data);
        });
      });
      await sending;
    }
  }
}

export async function parseBlock(event: any, context: any) {
  if (event.body) {
    return parseBlockImpl(event.body);
  } else {
    await Promise.all(
      event.Records.map(async (record: any) => {
        await parseBlockImpl(record.body);
      })
    );
  }
}

export async function parseParticipants(event: any, context: any) {
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
    const participants = transferEvents.reduce((acc, event) => {
      const from = (event.returnValues._from as string).toLowerCase();
      const to = (event.returnValues._to as string).toLowerCase();
      if (from != "0x0000000000000000000000000000000000000000") {
        acc.add(from);
      }
      if (to != "0x0000000000000000000000000000000000000000") {
        acc.add(to);
      }
      return acc;
    }, new Set<string>());

    const sendings = Array.from(participants).map(async participant => {
      const e: AddParticipantEvent = {
        kind: ORGANISATION_EVENT.ADD_PARTICIPANT,
        platform: ORGANISATION_PLATFORM.ARAGON,
        organisationAddress: organisationAddress,
        participant: participant
      };
      const message = {
        QueueUrl: SCRAPING_SQS_URL,
        MessageBody: JSON.stringify(e)
      };
      return new Promise((resolve, reject) => {
        sqs.sendMessage(message, (error, result) => {
          error ? reject(error) : resolve(result);
        });
      });
    });

    await Promise.all(sendings);

    return ok({
      addr: organisationAddress,
      participants: Array.from(participants)
    });
  } else {
    return notFound();
  }
}

export async function readExtendedBlock(event: any) {
  const id = Number(event.pathParameters.id);
  const block = await ethereum.extendedBlock(id);
  const events = await scraping.fromBlock(id);
  return ok({ block, events });
}

interface SqsEvent {
  Records: { body: string }[];
}

async function handleCreateOrganisation(event: OrganisationCreatedEvent): Promise<void> {
  await dynamo.put({
    TableName: ORGANISATIONS_TABLE,
    Item: {
      address: event.address,
      name: event.name,
      platform: event.platform,
      txid: event.txid,
      timestamp: event.timestamp,
      blockNumber: event.blockNumber
    }
  });
}

async function handleInstallApplication(event: AppInstalledEvent): Promise<void> {
  await dynamo.put({
    TableName: APPLICATIONS_TABLE,
    Item: {
      organisationAddress: event.organisationAddress,
      appId: event.appId,
      proxyAddress: event.proxyAddress,
      platform: event.platform,
      txid: event.txid,
      blockNumber: event.blockNumber,
      timestamp: event.timestamp
    }
  });
}

async function handleAddParticipant(event: AddParticipantEvent) {
  console.log("trying to put", {
    TableName: PARTICIPANTS_TABLE,
    Item: {
      organisationAddress: event.organisationAddress,
      participantAddress: event.participant,
      updatedAt: new Date().valueOf()
    }
  });
  await dynamo.put({
    TableName: PARTICIPANTS_TABLE,
    Item: {
      organisationAddress: event.organisationAddress,
      participantAddress: event.participant,
      updatedAt: new Date().valueOf()
    }
  });
}

async function putParticipant(event: ShareTransferEvent, account: string) {
  if (account !== "0x0000000000000000000000000000000000000000") {
    await dynamo.put({
      TableName: PARTICIPANTS_TABLE,
      Item: {
        organisationAddress: event.organisationAddress,
        participantAddress: account
      }
    });
  }
}

async function handleTransferShare(event: ShareTransferEvent) {
  await putParticipant(event, event.from);
  await putParticipant(event, event.to);
}

export async function saveOrganisationEvent(event: SqsEvent, context: any): Promise<void> {
  const loop = event.Records.map(async r => {
    const event = JSON.parse(r.body) as OrganisationEvent;
    switch (event.kind) {
      case ORGANISATION_EVENT.APP_INSTALLED:
        return handleInstallApplication(event);
      case ORGANISATION_EVENT.CREATED:
        return handleCreateOrganisation(event);
      case ORGANISATION_EVENT.ADD_PARTICIPANT:
        return handleAddParticipant(event);
      case ORGANISATION_EVENT.TRANSFER_SHARE:
        return handleTransferShare(event);
      default:
        throw new UnreachableCaseError(event);
    }
  });

  await Promise.all(loop);
}
