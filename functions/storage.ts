import { DynamoService } from "../lib/storage/dynamo.service";
import { ok } from "../lib/response";
import { ParticipantsRepository } from "../lib/storage/participants.repository";

const ORGANISATIONS_TABLE = String(process.env.ORGANISATIONS_TABLE);
const PARTICIPANTS_TABLE = String(process.env.PARTICIPANTS_TABLE);
const PARTICIPANTS_INDEX = String(process.env.PARTICIPANTS_INDEX);
const dynamo = new DynamoService();
const participantsRepository = new ParticipantsRepository(dynamo);

export async function readParticipants(event: any, context: any) {
  const organisationAddress = event.pathParameters.organisationAddress;
  const participants = await participantsRepository.allByOrganisationAddress(organisationAddress);
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
