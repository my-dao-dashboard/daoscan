import { Inject, Service } from "typedi";
import { bind } from "decko";
import { ENV, EnvService } from "../services/env.service";
import { APIGatewayEvent } from "aws-lambda";
import { ForbiddenError } from "../shared/errors";
import { MigrationUpScenario } from "./migration-up.scenario";
import { EventRepository } from "../storage/event.repository";
import { ScrapingEventFactory } from "../scraping/events/scraping-event.factory";
import { BlockFactory } from "../scraping/block.factory";
import { OrganisationRepository } from "../storage/organisation.repository";
import { HistoryRepository } from "../storage/history.repository";
import { RESOURCE_KIND } from "../storage/resource.kind";
import { DateTime } from "luxon";

@Service(MigrationController.name)
export class MigrationController {
  private readonly token: string;

  constructor(
    @Inject(MigrationUpScenario.name) private readonly upScenario: MigrationUpScenario,
    @Inject(EnvService.name) private readonly env: EnvService,
    @Inject(EventRepository.name) private readonly events: EventRepository,
    @Inject(ScrapingEventFactory.name) private readonly eventFactory: ScrapingEventFactory,
    @Inject(BlockFactory.name) private readonly blockFactory: BlockFactory,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(HistoryRepository.name) private readonly historyRepository: HistoryRepository
  ) {
    this.token = env.readString(ENV.UTIL_SECRET);
  }

  ensureAuthorization(event: APIGatewayEvent) {
    const authorizationHeader = event.headers["Authorization"];
    const expectedHeader = `Bearer ${this.token}`;
    if (authorizationHeader !== expectedHeader) {
      throw new ForbiddenError(`Authorization token is invalid`);
    }
  }

  @bind()
  async up(event: APIGatewayEvent): Promise<{ migrations: string[] }> {
    this.ensureAuthorization(event);
    const migrationNames = await this.upScenario.execute();
    return {
      migrations: migrationNames
    };
  }

  @bind()
  async timestamps(event: APIGatewayEvent): Promise<{ amount: number }> {
    this.ensureAuthorization(event);
    const limit = Number(event.queryStringParameters?.limit) || 100;
    let n = 0;
    const organisations = await this.organisationRepository.oldOnes(limit);
    for (let org of organisations) {
      const histories = await this.historyRepository.allByResource(org.id, RESOURCE_KIND.ORGANISATION);
      const eventIds = histories.map(h => h.eventId);
      const events = await this.events.allByIds(eventIds);
      if (events && events[0]) {
        org.createdAt = DateTime.fromJSDate(events[0].timestamp);
        await this.organisationRepository.save(org);
      }
      n = n + 1;
    }
    // const rawEvents = await this.events.oldOnes(limit);
    // for (let e of rawEvents) {
    //   const dsEvent = await this.eventFactory.fromStorage(e.id);
    //   if (dsEvent) {
    //     await dsEvent.revert();
    //     await dsEvent.commit();
    //     n = n + 1;
    //   }
    // }

    return {
      amount: n
    };
  }
}
