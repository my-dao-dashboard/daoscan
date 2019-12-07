import {
  AddParticipantEvent,
  AppInstalledEvent,
  ORGANISATION_EVENT,
  OrganisationCreatedEvent,
  OrganisationEvent, ShareTransferEvent
} from "../lib/organisation-events";
import { UnreachableCaseError } from "../lib/unreachable-case-error";
import { DynamoService } from "../lib/dynamo.service";
import { ok } from "../lib/response";
import {EthereumService} from "../lib/ethereum.service";

interface SqsEvent {
  Records: { body: string }[];
}

const INFURA_PROJECT_ID = String(process.env.INFURA_PROJECT_ID);
const ORGANISATIONS_TABLE = String(process.env.ORGANISATIONS_TABLE);
const APPLICATIONS_TABLE = String(process.env.APPLICATIONS_TABLE);
const PARTICIPANTS_TABLE = String(process.env.PARTICIPANTS_TABLE);
const PARTICIPANTS_INDEX = String(process.env.PARTICIPANTS_INDEX);
const dynamo = new DynamoService();
const ethereum = new EthereumService(INFURA_PROJECT_ID);

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

async function handleTransferShare(event: ShareTransferEvent) {
  await dynamo.put({
    TableName: PARTICIPANTS_TABLE,
    Item: {
      organisationAddress: event.organisationAddress,
      participantAddress: event.from,
      updatedAt: new Date().valueOf()

    }
  });
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

export async function readParticipants(event: any, context: any) {
  const organisationAddress = event.pathParameters.organisationAddress;
  const items = await dynamo.query({
    TableName: PARTICIPANTS_TABLE,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "organisationAddress = :organisationAddress",
    ExpressionAttributeValues: {
      ":organisationAddress": organisationAddress
    }
  });
  const participants = items.Items?.map(item => {
    return {
      participantAddress: item.participantAddress,
      updatedAt: item.updatedAt
    };
  });

  return ok({
    participants
  });
}

export async function readOrganisations(event: any, context: any) {
  const participantAddress = event.pathParameters.participantAddress?.toLowerCase();
  const items = await dynamo.query({
    TableName: PARTICIPANTS_TABLE,
    IndexName: PARTICIPANTS_INDEX,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "participantAddress = :participantAddress",
    ExpressionAttributeValues: {
      ":participantAddress": participantAddress
    }
  });
  const organisations = items.Items?.map(item => {
    return {
      organisationAddress: item.organisationAddress,
      updatedAt: item.updatedAt
    };
  });

  return ok({ participantAddress, organisations });
}

export async function allOrgs(event: any, context: any) {
  const items = await dynamo.scan({
    TableName: ORGANISATIONS_TABLE,
    ProjectionExpression: "organisationAddress, blockNumber"
  });

  return ok({ items });
}
