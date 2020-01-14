import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { ScrapingService } from "./scraping.service";
import { BadRequestError } from "../shared/errors";
import { OrganisationEvent } from "../shared/organisation-events";
import { bind } from "decko";
import { ExtendedBlock } from "../services/ethereum.service";
import { ok } from "../shared/http-handler";
import { Service, Inject } from "typedi";

function isAPIGatewayEvent(event: any): event is APIGatewayEvent {
  return !!event.httpMethod && !!event.path;
}

@Service(ScrapingController.name)
export class ScrapingController {
  constructor(@Inject(ScrapingService.name) private readonly scrapingService: ScrapingService) {}

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
