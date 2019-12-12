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

  async allByOrganisationAddress(organisationAddress: string): Promise<ParticipantEntity[]> {
    const items = await this.dynamo.query({
      TableName: this.tableName,
      ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
      KeyConditionExpression: "organisationAddress = :organisationAddress",
      ExpressionAttributeValues: {
        ":organisationAddress": organisationAddress.toLowerCase()
      }
    });
    if (items.Items && items.Items.length) {
      return items.Items.map(item => {
        return {
          organisationAddress: String(item.organisationAddress),
          participantAddress: String(item.participantAddress),
          updatedAt: Number(item.updatedAt)
        };
      });
    } else {
      return [];
    }
  }
}