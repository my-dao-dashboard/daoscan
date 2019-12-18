import { DynamoService } from "../lib/storage/dynamo.service";
import { notFound, ok } from "../lib/response";
import { ParticipantsRepository } from "../lib/storage/participants.repository";
import { OrganisationsRepository } from "../lib/storage/organisations.repository";
import { APIGatewayEvent } from "aws-lambda";

const dynamo = new DynamoService();
const participantsRepository = new ParticipantsRepository(dynamo);
const organisationsRepository = new OrganisationsRepository(dynamo);

export async function readParticipants(event: APIGatewayEvent) {
  const organisationAddress = event.pathParameters?.organisationAddress;
  if (!organisationAddress) return notFound();
  const participants = await participantsRepository.allByOrganisationAddress(organisationAddress);
  return ok({
    participants
  });
}

export async function readOrganisations(event: APIGatewayEvent) {
  const participantAddress = event.pathParameters?.participantAddress?.toLowerCase();
  if (!participantAddress) return notFound();
  const organisations = await participantsRepository.allOrganisations(participantAddress);
  return ok({ participantAddress, organisations });
}

export async function allOrgs() {
  const items = await organisationsRepository.all();
  const count = items.length;

  return ok({ count, items });
}
