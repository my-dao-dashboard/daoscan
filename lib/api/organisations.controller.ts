import { OrganisationEntity, OrganisationsRepository } from "../storage/organisations.repository";
import { bind } from "decko";
import { ApiEvent } from "../shared/api.types";
import { BadRequestError } from "../shared/errors";
import { ParticipantEntity, ParticipantsRepository } from "../storage/participants.repository";
import {notFound, ok} from "../shared/response";

export class OrganisationsController {
  constructor(
    private readonly organisationsRepository: OrganisationsRepository,
    private readonly participantsRepository: ParticipantsRepository
  ) {}

  @bind()
  async participants (event: ApiEvent) {
    const organisationAddress = event.pathParameters?.organisationAddress;
    if (!organisationAddress) return notFound();
    const participants = await this.participantsRepository.allByOrganisationAddress(organisationAddress);
    return{
      participants
    }
  }

  @bind()
  async byParticipant(event: ApiEvent): Promise<{ participantAddress: string; organisations: ParticipantEntity[] }> {
    const participantAddress = event.pathParameters?.participantAddress?.toLowerCase();
    if (!participantAddress) throw new BadRequestError(`No participant address specified`);
    const organisations = await this.participantsRepository.allOrganisations(participantAddress);
    return { participantAddress, organisations };
  }

  @bind()
  async index(): Promise<{ count: number; items: OrganisationEntity[] }> {
    const items = await this.organisationsRepository.all();
    const count = items.length;

    return {
      count,
      items
    };
  }
}
