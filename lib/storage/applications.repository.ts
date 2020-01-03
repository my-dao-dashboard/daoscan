import { DynamoService } from "./dynamo.service";
import { Service, Inject } from "typedi";
import { APP_ID } from "../app-id";
import { ENV } from "../shared/env";
import { EnvService, IEnvService } from "../services/env.service";
import { ApplicationEntity } from "./application.entity";

export interface Key {
  organisationAddress: string;
  appId: string;
}

export enum FIELD {
  PROXY_ADDRESS = "proxyAddress"
}

type ProxyAddressResult = { proxyAddress: string };

@Service(ApplicationsRepository.name)
export class ApplicationsRepository {
  private readonly tableName: string;

  constructor(
    @Inject(DynamoService.name) private readonly dynamo: DynamoService,
    @Inject(EnvService.name) env: IEnvService
  ) {
    this.tableName = env.readString(ENV.APPLICATIONS_TABLE);
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

  async bankAddress(organisationAddress: string): Promise<string | undefined> {
    const result = await this.get<ProxyAddressResult>(
      {
        organisationAddress: organisationAddress.toLowerCase(),
        appId: APP_ID.ARAGON_VAULT
      },
      [FIELD.PROXY_ADDRESS]
    );
    if (result) {
      return result.proxyAddress;
    }
  }

  async tokenAddress(organisationAddress: string): Promise<string | undefined> {
    const result = await this.get<ProxyAddressResult>(
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
