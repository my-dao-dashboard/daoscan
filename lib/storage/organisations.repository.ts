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
