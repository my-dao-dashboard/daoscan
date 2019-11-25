import { ORGANISATION_EVENT, OrganisationEvent } from "../lib/organisation-events";
import { UnreachableCaseError } from "../lib/unreachable-case-error";
import { DynamoService } from "../lib/dynamo.service";

interface SqsEvent {
  Records: { body: string }[];
}

const ORGANISATIONS_TABLE = String(process.env.ORGANISATIONS_TABLE);
const dynamo = new DynamoService();

export async function saveOrganisationEvent(event: SqsEvent, context: any) {
  const loop = event.Records.map(async r => {
    const event = JSON.parse(r.body) as OrganisationEvent;
    switch (event.kind) {
      case ORGANISATION_EVENT.APP_INSTALLED:
        return;
      case ORGANISATION_EVENT.CREATED:
        return dynamo.put({
          TableName: ORGANISATIONS_TABLE,
          Item: {
            address: event.address,
            name: event.name,
            platform: event.platform,
            txid: event.txid,
            timestamp: event.timestamp,
            blockNumber: event.blockNumber
          }
        });
      default:
        throw new UnreachableCaseError(event);
    }
  });

  await Promise.all(loop);
}
