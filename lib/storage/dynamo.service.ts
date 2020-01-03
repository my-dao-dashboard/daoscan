import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { Service } from "typedi";

@Service(DynamoService.name)
export class DynamoService {
  constructor(private readonly client: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient()) {}

  createSet(
    list: number[] | string[] | DocumentClient.binaryType[],
    options?: DocumentClient.CreateSetOptions
  ): DocumentClient.StringSet | DocumentClient.NumberSet | DocumentClient.BinarySet {
    return this.client.createSet(list, options);
  }

  scan(payload: DocumentClient.ScanInput): Promise<DocumentClient.ScanOutput> {
    return new Promise<DocumentClient.ScanOutput>((resolve, reject) => {
      this.client.scan(payload, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  }

  query(payload: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> {
    return new Promise<DocumentClient.QueryOutput>((resolve, reject) => {
      this.client.query(payload, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  }

  get(payload: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> {
    return new Promise<DocumentClient.GetItemOutput>((resolve, reject) => {
      this.client.get(payload, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  }

  put(payload: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput> {
    return new Promise((resolve, reject) => {
      this.client.put(payload, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  }

  update(payload: DocumentClient.UpdateItemInput): Promise<DocumentClient.UpdateItemOutput> {
    return new Promise((resolve, reject) => {
      this.client.update(payload, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  }
}
