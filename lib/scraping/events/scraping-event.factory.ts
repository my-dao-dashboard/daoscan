import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "./scraping-event";
import { AragonEventFactory } from "../aragon/aragon-event.factory";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { UnreachableCaseError } from "../../shared/unreachable-case-error";
import { AppInstalledEvent } from "./app-installed.event";
import { OrganisationCreatedEvent } from "./organisation-created.event";

@Service(ScrapingEventFactory.name)
export class ScrapingEventFactory {
  constructor(@Inject(AragonEventFactory.name) private readonly aragon: AragonEventFactory) {}

  fromStorage(eventId: string) {
    
  }

  fromJSON(json: ScrapingEvent): AppInstalledEvent | OrganisationCreatedEvent {
    switch (json.kind) {
      case SCRAPING_EVENT_KIND.APP_INSTALLED:
        return new AppInstalledEvent(json);
      case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
        return new OrganisationCreatedEvent(json);
      default:
        throw new UnreachableCaseError(json);
    }
  }

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const aragonEvents = await this.aragon.fromBlock(block);
    return aragonEvents;
  }
}
