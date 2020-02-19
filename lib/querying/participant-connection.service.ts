import { Inject, Service } from "typedi";
import { MembershipRepository } from "../storage/membership.repository";
import { Participant } from "../domain/participant";
import { Organisation } from "../domain/organisation";

function participantToCursor(participant: Participant) {
  return Buffer.from(participant.address).toString("base64");
}

function cursorToParticipantAddress(cursor: string) {
  return Buffer.from(cursor, "base64").toString();
}

@Service(ParticipantConnectionService.name)
export class ParticipantConnectionService {
  constructor(@Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository) {}

  totalCount(organisationAddress: string): Promise<number> {
    return this.membershipRepository.countByOrganisationAddress(organisationAddress);
  }

  async edges(organisation: Organisation, first: number, after: string | undefined) {
    const afterParticipantAddress = after ? cursorToParticipantAddress(after) : undefined;
    const addresses = await this.membershipRepository.allByOrganisationAddress(organisation.address, first, afterParticipantAddress);
    return addresses.map(address => {
      const participant = new Participant(address, organisation);
      return {
        node: participant,
        cursor: participantToCursor(participant)
      };
    });
  }
}
