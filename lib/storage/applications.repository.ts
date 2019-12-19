import { DynamoService } from "./dynamo.service";
import { ENV, FromEnv } from "../shared/from-env";
import { ORGANISATION_PLATFORM } from "../organisation-events";
import { Service, Inject } from "typedi";
import {APP_ID} from "../app-id";

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

@Service()
export class ApplicationsRepository {
  private readonly tableName: string;

  constructor(@Inject(type => DynamoService) private readonly dynamo: DynamoService) {
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
        appId: APP_ID.SHARE
      },
      [FIELD.PROXY_ADDRESS]
    );
    if (result) {
      return result.proxyAddress;
    }
  }

  async tokenControllerAddress(organisationAddress: string): Promise<string | undefined> {
    type Result = { proxyAddress: string };
    const result = await this.get<Result>(
      {
        organisationAddress: organisationAddress.toLowerCase(),
        appId: APP_ID.ARAGON_TOKEN_CONTROLLER
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
