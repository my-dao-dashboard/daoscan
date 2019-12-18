import { notFound, ok } from "../lib/shared/response";
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
import { UnreachableCaseError } from "../lib/shared/unreachable-case-error";
import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { ScrapingContainer } from "../lib/scraping/scraping.container";

const scrapingContainer = new ScrapingContainer();

async function parseBlockImpl(body: any) {
  const data = JSON.parse(body);
  const id = Number(data.id);
  console.log(`Starting parsing block #${id}...`);
  const events = await scrapingContainer.scrapingService.fromBlock(id);
  await scrapingContainer.scrapingQueue.sendBatch(events);
  await scrapingContainer.blocksRepository.markParsed(id);
  console.log(`Parsed block #${id}: events=${events.length}`);
  return ok({
    events: events
  });
}

export async function tickBlock() {
  const block = await scrapingContainer.ethereum.block("latest");
  const latest = block.number;
  const previous = latest - 20;
  let blockNumbers = [];
  for (let i = previous; i <= latest; i++) blockNumbers.push(i);
  await Promise.all(
    blockNumbers.map(async i => {
      const isPresent = await scrapingContainer.blocksRepository.isPresent(i);
      if (!isPresent) {
        await scrapingContainer.blocksQueue.send(i);
      }
    })
  );
}

function isAPIGatewayEvent(event: any): event is APIGatewayEvent {
  return !!event.httpMethod && !!event.path;
}

export async function parseBlock(event: APIGatewayEvent | SQSEvent) {
  if (isAPIGatewayEvent(event)) {
    return parseBlockImpl(event.body);
  } else {
    await Promise.all(
      event.Records.map(async (record: any) => {
        await parseBlockImpl(record.body);
      })
    );
  }
}

export async function parseParticipants(event: APIGatewayEvent) {
  const data = JSON.parse(String(event.body));
  const organisationAddress = data.organisationAddress;
  const tokenControllerAddress = await scrapingContainer.applicationsRepository.tokenAddress(organisationAddress);
  if (tokenControllerAddress) {
    const tokenController = new scrapingContainer.ethereum.web3.eth.Contract(TOKEN_CONTROLLER_ABI, tokenControllerAddress);
    const tokenAddress = await tokenController.methods.token().call();
    const token = new scrapingContainer.ethereum.web3.eth.Contract(TOKEN_ABI, tokenAddress);
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
    await scrapingContainer.scrapingQueue.sendBatch(events);

    return ok({
      addr: organisationAddress,
      participants: Array.from(participants)
    });
  } else {
    return notFound();
  }
}

export async function readExtendedBlock(event: APIGatewayEvent) {
  const idParameter = event.pathParameters?.id;
  if (!idParameter) return notFound({ error: "ID Required" });
  const id = Number(idParameter);
  const block = await scrapingContainer.ethereum.extendedBlock(id);
  const events = await scrapingContainer.scrapingService.fromBlock(id);
  return ok({ block, events });
}

async function handleCreateOrganisation(event: OrganisationCreatedEvent): Promise<void> {
  await scrapingContainer.organisationsRepository.save(event);
}

async function handleInstallApplication(event: AppInstalledEvent): Promise<void> {
  console.log(`Saving application...`, event);
  await scrapingContainer.applicationsRepository.save(event);
  console.log(`Application saved`, event);
}

async function handleAddParticipant(event: AddParticipantEvent) {
  await scrapingContainer.participantsRepository.save({
    organisationAddress: event.organisationAddress,
    participantAddress: event.participant,
    updatedAt: new Date().valueOf()
  });
}

async function putParticipant(event: ShareTransferEvent, account: string) {
  if (account !== "0x0000000000000000000000000000000000000000") {
    await scrapingContainer.participantsRepository.save({
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

export async function saveOrganisationEvent(event: SQSEvent): Promise<void> {
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
