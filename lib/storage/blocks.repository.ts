import { DynamoService } from "./dynamo.service";
import { FromEnv } from "../from-env";

export class BlocksRepository {
  private readonly tableName: string;

  constructor(private readonly dynamo: DynamoService) {
    this.tableName = FromEnv.string("BLOCKS_TABLE");
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
