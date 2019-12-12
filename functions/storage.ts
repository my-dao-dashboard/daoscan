import { DynamoService } from "../lib/storage/dynamo.service";
import { ok } from "../lib/response";
import { ParticipantsRepository } from "../lib/storage/participants.repository";
import { OrganisationsRepository } from "../lib/storage/organisations.repository";

const dynamo = new DynamoService();
const participantsRepository = new ParticipantsRepository(dynamo);
const organisationsRepository = new OrganisationsRepository(dynamo);

export async function readParticipants(event: any) {
  const organisationAddress = event.pathParameters.organisationAddress;
  const participants = await participantsRepository.allByOrganisationAddress(organisationAddress);
  return ok({
    participants
  });
}

export async function readOrganisations(event: any) {
  const participantAddress = event.pathParameters.participantAddress?.toLowerCase();
  const organisations = await participantsRepository.allOrganisations(participantAddress);
  return ok({ participantAddress, organisations });
}

export async function allOrgs(event: any) {
  const items = await organisationsRepository.all();
  const count = items.length

  return ok({ count, items });
}
