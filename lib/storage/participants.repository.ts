import { DynamoService } from "./dynamo.service";
import { ENV, FromEnv } from "../shared/from-env";
import { Service, Inject } from "typedi";

export interface ParticipantEntity {
  organisationAddress: string;
  participantAddress: string;
  updatedAt: number;
}

@Service()
export class ParticipantsRepository {
  private readonly tableName: string;
  private readonly participantsIndexName: string;

  constructor(@Inject(type => DynamoService) private readonly dynamo: DynamoService) {
    this.tableName = FromEnv.readString(ENV.PARTICIPANTS_TABLE);
    this.participantsIndexName = FromEnv.readString(ENV.PARTICIPANTS_INDEX);
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

  async allOrganisations(participantAddress: string): Promise<ParticipantEntity[]> {
    const items = await this.dynamo.query({
      TableName: this.tableName,
      IndexName: this.participantsIndexName,
      ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
      KeyConditionExpression: "participantAddress = :participantAddress",
      ExpressionAttributeValues: {
        ":participantAddress": participantAddress
      }
    });
    if (items.Items && items.Items.length) {
      return items.Items.map(item => {
        return {
          organisationAddress: String(item.organisationAddress),
          participantAddress: participantAddress,
          updatedAt: Number(item.updatedAt)
        };
      });
    } else {
      return [];
    }
  }

  async byAddressInOrganisation(
    organisationAddress: string,
    participantAddress: string
  ): Promise<ParticipantEntity | null> {
    const items = await this.dynamo.query({
      TableName: this.tableName,
      ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
      KeyConditionExpression: "organisationAddress = :organisationAddress AND participantAddress = :participantAddress",
      ExpressionAttributeValues: {
        ":organisationAddress": organisationAddress.toLowerCase(),
        ":participantAddress": participantAddress.toLowerCase()
      },
      Limit: 1
    });
    if (items.Items && items.Items[0]) {
      const item = items.Items[0];
      return {
        organisationAddress: String(item.organisationAddress),
        participantAddress: String(item.participantAddress),
        updatedAt: Number(item.updatedAt)
      };
    } else {
      return null;
    }
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
