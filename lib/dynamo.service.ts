import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

export class DynamoService {
  private readonly client = new AWS.DynamoDB.DocumentClient();

  put (payload: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput> {
    return new Promise((resolve, reject) => {
      this.client.put(payload, (error, result) => {
        error ? reject(error) : resolve(result)
      })
    })
  }

  update (payload: DocumentClient.UpdateItemInput): Promise<DocumentClient.UpdateItemOutput> {
    return new Promise((resolve, reject) => {
      this.client.update(payload, (error, result) => {
        error ? reject(error) : resolve(result)
      })
    })
  }
}
