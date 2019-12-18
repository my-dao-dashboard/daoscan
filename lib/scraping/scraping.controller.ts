import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { ScrapingService } from "./scraping.service";
import { BadRequestError } from "../shared/errors";
import {
  AddParticipantEvent,
  ORGANISATION_EVENT,
  ORGANISATION_PLATFORM,
  OrganisationEvent
} from "../organisation-events";
import { bind } from "decko";
import { TOKEN_ABI, TOKEN_CONTROLLER_ABI } from "./aragon.constants";
import { ExtendedBlock } from "../ethereum.service";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { handler, ok } from "../shared/handler";

function isAPIGatewayEvent(event: any): event is APIGatewayEvent {
  return !!event.httpMethod && !!event.path;
}

export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  parseBlock(event: APIGatewayEvent): Promise<{ body: string; statusCode: number }>;
  parseBlock(event: SQSEvent): Promise<void>;
  @bind()
  async parseBlock(event: APIGatewayEvent | SQSEvent): Promise<{ body: string; statusCode: number } | void> {
    if (isAPIGatewayEvent(event)) {
      if (event.body) {
        const result = await this.scrapingService.parseBlock(event.body);
        return ok(result);
      } else {
        throw new BadRequestError("Expect body with block id");
      }
    } else {
      await Promise.all(
        event.Records.map(async record => {
          await this.scrapingService.parseBlock(record.body);
        })
      );
    }
  }

  @bind()
  parseParticipants(event: APIGatewayEvent): Promise<{ addr: string; participants: string[] }> {
    const data = JSON.parse(String(event.body));
    const organisationAddress = data.organisationAddress;
    return this.scrapingService.parseParticipants(organisationAddress);
  }

  @bind()
  async readExtendedBlock(event: APIGatewayEvent): Promise<{ block: ExtendedBlock; events: OrganisationEvent[] }> {
    const idParameter = event.pathParameters?.id;
    if (!idParameter) throw new BadRequestError("Expected block id");
    const id = Number(idParameter);
    return this.scrapingService.readExtendedBlock(id);
  }

  @bind()
  async saveOrganisationEvent(event: SQSEvent): Promise<void> {
    const loop = event.Records.map(async r => {
      const event = JSON.parse(r.body) as OrganisationEvent;
      await this.scrapingService.saveOrganisationEvent(event);
    });

    await Promise.all(loop);
  }
}
