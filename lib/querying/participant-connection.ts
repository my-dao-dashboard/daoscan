import { ParticipantConnectionService } from "./participant-connection.service";
import { Organisation } from "../domain/organisation";

export class ParticipantConnection {
  constructor(
    readonly organisation: Organisation,
    readonly first: number,
    readonly after: string | undefined,
    readonly participantConnectionService: ParticipantConnectionService
  ) {}

  totalCount(): Promise<number> {
    return this.participantConnectionService.totalCount(this.organisation.address);
  }

  edges() {
    return this.participantConnectionService.edges(this.organisation, this.first, this.after);
  }
}
