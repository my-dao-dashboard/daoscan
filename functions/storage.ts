import { ORGANISATION_EVENT, OrganisationEvent } from "../lib/organisation-events";
import AWS from "aws-sdk";
import { UnreachableCaseError } from "../lib/unreachable-case-error";

interface SqsEvent {
  Records: { body: string }[];
}

const ORGANISATIONS_TABLE = String(process.env.ORGANISATIONS_TABLE);
const dynamo = new AWS.DynamoDB.DocumentClient();

export async function saveOrganisationEvent(event: SqsEvent, context: any) {
  const queries = event.Records.map(r => {
    const event = JSON.parse(r.body) as OrganisationEvent;
    switch (event.kind) {
      case ORGANISATION_EVENT.CREATED:
        return {
          TableName: ORGANISATIONS_TABLE,
          Item: {
            address: event.address,
            name: event.name,
            platform: event.platform,
            txid: event.txid,
            timestamp: event.timestamp,
            blockNumber: event.blockNumber,
          }
        };
      case ORGANISATION_EVENT.APP_INSTALLED:
        return;
      default:
        throw new UnreachableCaseError(event);
    }
  });

  const writings = queries.map(q => {
    return new Promise((resolve, reject) => {
      if (q) {
        dynamo.put(q, (error, ok) => {
          error ? reject(error) : resolve(ok)
        })
      } else {
        resolve()
      }
    })
  })

  await Promise.all(writings)
}
