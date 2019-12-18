import { notFound, ok } from "../lib/util/response";
import { APIGatewayEvent } from "aws-lambda";
import { ApiContainer } from "../lib/api.container";

const container = new ApiContainer();

export async function readParticipants(event: APIGatewayEvent) {
  const organisationAddress = event.pathParameters?.organisationAddress;
  if (!organisationAddress) return notFound();
  const participants = await container.participantsRepository.allByOrganisationAddress(organisationAddress);
  return ok({
    participants
  });
}

export async function readOrganisations(event: APIGatewayEvent) {
  const participantAddress = event.pathParameters?.participantAddress?.toLowerCase();
  if (!participantAddress) return notFound();
  const organisations = await container.participantsRepository.allOrganisations(participantAddress);
  return ok({ participantAddress, organisations });
}

export async function allOrgs() {
  const items = await container.organisationsRepository.all();
  const count = items.length;

  return ok({ count, items });
}
