import { DynamoService } from "./dynamo.service";
import { FromEnv } from "../shared/from-env";
import { Service, Inject } from "typedi";
import { ENV } from "../shared/env";

@Service()
export class BlocksRepository {
  private readonly tableName: string;

  constructor(@Inject(type => DynamoService) private readonly dynamo: DynamoService) {
    this.tableName = FromEnv.readString(ENV.BLOCKS_TABLE);
  }

  async markParsed(id: number): Promise<void> {
    await this.dynamo.put({
      TableName: this.tableName,
      Item: {
        blockNumber: id
      }
    });
  }

  async isPresent(id: number): Promise<boolean> {
    const items = await this.dynamo.get({
      TableName: this.tableName,
      ProjectionExpression: "blockNumber",
      Key: {
        blockNumber: id
      }
    });
    return !!items.Item;
  }
}
