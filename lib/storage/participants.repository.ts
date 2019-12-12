import { DynamoService } from "./dynamo.service";
import { ENV, FromEnv } from "../from-env";

export interface ParticipantEntity {
  organisationAddress: string;
  participantAddress: string;
  updatedAt: number;
}

export class ParticipantsRepository {
  private readonly tableName: string;

  constructor(private readonly dynamo: DynamoService) {
    this.tableName = FromEnv.readString(ENV.PARTICIPANTS_TABLE);
  }

  async save(participant: ParticipantEntity): Promise<void> {
    console.log("Saving participant", participant);
    await this.dynamo.put({
      TableName: this.tableName,
      Item: {
        organisationAddress: participant.organisationAddress.toLowerCase(),
        participantAddress: participant.participantAddress.toLowerCase(),
        updatedAt: participant.updatedAt
      }
    });
  }
}
