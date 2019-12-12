import { DynamoService } from "./dynamo.service";
import { ENV, FromEnv } from "../from-env";
import { ORGANISATION_PLATFORM } from "../organisation-events";

export interface OrganisationEntity {
  address: string;
  name: string;
  platform: ORGANISATION_PLATFORM;
  txid: string;
  timestamp: number;
  blockNumber: number;
}

export class OrganisationsRepository {
  private readonly tableName: string;

  constructor(private readonly dynamo: DynamoService) {
    this.tableName = FromEnv.readString(ENV.ORGANISATIONS_TABLE);
  }

  async all(): Promise<OrganisationEntity[]> {
    const items = await this.dynamo.scan({
      TableName: this.tableName,
      ProjectionExpression: "address, #orgName, platform, txid, #orgTimestamp, blockNumber",
      ExpressionAttributeNames: {
        "#orgName": "name",
        "#orgTimestamp": "timestamp"
      }
    });
    if (items.Items && items.Items.length) {
      return items.Items.map<OrganisationEntity>(item => {
        return {
          address: String(item.address),
          name: String(item.name),
          platform: ORGANISATION_PLATFORM.fromString(item.platform),
          txid: String(item.txid),
          timestamp: Number(item.timestamp),
          blockNumber: Number(item.blockNumber)
        };
      });
    } else {
      return [];
    }
  }

  async save(entity: OrganisationEntity) {
    await this.dynamo.put({
      TableName: this.tableName,
      Item: {
        address: entity.address.toLowerCase(),
        name: entity.name,
        platform: entity.platform,
        txid: entity.txid,
        timestamp: entity.timestamp,
        blockNumber: entity.blockNumber
      }
    });
  }
}
