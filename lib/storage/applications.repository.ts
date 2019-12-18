import {DynamoService} from "./dynamo.service";
import {ENV, FromEnv} from "../shared/from-env";
import {ORGANISATION_PLATFORM} from "../organisation-events";

export interface Key {
  organisationAddress: string;
  appId: string;
}

export interface ApplicationEntity {
  platform: ORGANISATION_PLATFORM;
  organisationAddress: string;
  appId: string;
  proxyAddress: string;
  txid: string;
  blockNumber: number;
  timestamp: number;
}

export enum FIELD {
  PROXY_ADDRESS = "proxyAddress"
}

export class ApplicationsRepository {
  private readonly tableName: string;

  constructor(private readonly dynamo: DynamoService) {
    this.tableName = FromEnv.readString(ENV.APPLICATIONS_TABLE);
  }

  async save(entity: ApplicationEntity) {
    await this.dynamo.put({
      TableName: this.tableName,
      Item: {
        organisationAddress: entity.organisationAddress.toLowerCase(),
        appId: entity.appId.toLowerCase(),
        proxyAddress: entity.proxyAddress,
        platform: entity.platform,
        txid: entity.txid,
        blockNumber: entity.blockNumber,
        timestamp: entity.timestamp
      }
    });
  }

  async tokenAddress(organisationAddress: string): Promise<string | undefined> {
    type Result = { proxyAddress: string };
    const result = await this.get<Result>(
      {
        organisationAddress: organisationAddress.toLowerCase(),
        appId: "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f"
      },
      [FIELD.PROXY_ADDRESS]
    );
    if (result) {
      return result.proxyAddress;
    }
  }

  async get<T>(key: Key, projection: Array<FIELD>): Promise<T | undefined> {
    const response = await this.dynamo.get({
      TableName: this.tableName,
      ProjectionExpression: projection.join(","),
      Key: key
    });
    if (response.Item) {
      return response.Item as T;
    }
  }
}
