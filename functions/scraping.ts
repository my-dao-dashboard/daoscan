import { notFound, ok } from "../lib/response";
import { ScrapingService } from "../lib/scraping/scraping.service";
import { EthereumService } from "../lib/ethereum.service";
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
import { ScrapingQueue } from "../lib/scraping.queue";
import { QueueService } from "../lib/queue.service";
import { BlocksQueue } from "../lib/blocks.queue";
import { ApplicationsRepository } from "../lib/storage/applications.repository";
import { ParticipantsRepository } from "../lib/storage/participants.repository";
import { OrganisationsRepository } from "../lib/storage/organisations.repository";

const ethereum = new EthereumService();
const dynamo = new DynamoService();
const scraping = new ScrapingService(ethereum, dynamo);
const blocksRepository = new BlocksRepository(dynamo);
const queueService = new QueueService();
const scrapingQueue = new ScrapingQueue(queueService);
const blocksQueue = new BlocksQueue(queueService);
const applicationsRepository = new ApplicationsRepository(dynamo);
const participantsRepository = new ParticipantsRepository(dynamo);
const organisationsRepository = new OrganisationsRepository(dynamo);

async function parseBlockImpl(body: any) {
  const data = JSON.parse(body);
  const id = Number(data.id);
  console.log(`Starting parsing block #${id}...`);
  const events = await scraping.fromBlock(id);
  await scrapingQueue.sendBatch(events);
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
  let blockNumbers = [];
  for (let i = previous; i <= latest; i++) blockNumbers.push(i);
  await Promise.all(
    blockNumbers.map(async i => {
      const isPresent = await blocksRepository.isPresent(i);
      if (!isPresent) {
        await blocksQueue.send(i);
      }
    })
  );
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
  const tokenControllerAddress = await applicationsRepository.tokenAddress(organisationAddress);
  if (tokenControllerAddress) {
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

    const events = Array.from(participants).map<AddParticipantEvent>(participant => {
      return {
        kind: ORGANISATION_EVENT.ADD_PARTICIPANT,
        platform: ORGANISATION_PLATFORM.ARAGON,
        organisationAddress: organisationAddress,
        participant: participant
      };
    });
    await scrapingQueue.sendBatch(events);

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
  await organisationsRepository.save(event);
}

async function handleInstallApplication(event: AppInstalledEvent): Promise<void> {
  console.log(`Saving application...`, event);
  await applicationsRepository.save(event);
  console.log(`Application saved`, event);
}

async function handleAddParticipant(event: AddParticipantEvent) {
  await participantsRepository.save({
    organisationAddress: event.organisationAddress,
    participantAddress: event.participant,
    updatedAt: new Date().valueOf()
  });
}

async function putParticipant(event: ShareTransferEvent, account: string) {
  if (account !== "0x0000000000000000000000000000000000000000") {
    await participantsRepository.save({
      organisationAddress: event.organisationAddress,
      participantAddress: account,
      updatedAt: new Date().valueOf()
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
