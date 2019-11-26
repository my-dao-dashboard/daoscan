import {
  AddParticipantEvent,
  AppInstalledEvent,
  ORGANISATION_EVENT,
  OrganisationCreatedEvent,
  OrganisationEvent
} from "../lib/organisation-events";
import { UnreachableCaseError } from "../lib/unreachable-case-error";
import { DynamoService } from "../lib/dynamo.service";

interface SqsEvent {
  Records: { body: string }[];
}

const ORGANISATIONS_TABLE = String(process.env.ORGANISATIONS_TABLE);
const APPLICATIONS_TABLE = String(process.env.APPLICATIONS_TABLE);
const PARTICIPANTS_TABLE = String(process.env.PARTICIPANTS_TABLE);
const dynamo = new DynamoService();

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
  console.log('trying to put', {
    TableName: PARTICIPANTS_TABLE,
    Item: {
      organisationAddress: event.organisationAddress,
      participantAddress: event.participant,
      updatedAt: new Date().valueOf()
    }
  })
  await dynamo.put({
    TableName: PARTICIPANTS_TABLE,
    Item: {
      organisationAddress: event.organisationAddress,
      participantAddress: event.participant,
      updatedAt: new Date().valueOf()
    }
  });
}

export async function saveOrganisationEvent(event: SqsEvent, context: any) {
  const loop = event.Records.map(async r => {
    const event = JSON.parse(r.body) as OrganisationEvent;
    switch (event.kind) {
      case ORGANISATION_EVENT.APP_INSTALLED:
        return handleInstallApplication(event);
      case ORGANISATION_EVENT.CREATED:
        return handleCreateOrganisation(event);
      case ORGANISATION_EVENT.ADD_PARTICIPANT:
        return handleAddParticipant(event);
      default:
        throw new UnreachableCaseError(event);
    }
  });

  await Promise.all(loop);
}
