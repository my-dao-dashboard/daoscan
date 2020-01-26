import { Inject, Service } from "typedi";
import { Delta } from "./delta";
import { Event } from "../../storage/event.row";
import { ConnectionFactory } from "../../storage/connection.factory";
import { AppInstalledEvent } from "./scraping-event";
import { UUID } from "../../storage/uuid";
import { EventRepository } from "../../storage/event.repository";
import { Application } from "../../storage/application.row";
import { ApplicationRepository } from "../../storage/application.repository";

@Service(AppInstalledEventDelta.name)
export class AppInstalledEventDelta implements Delta<AppInstalledEvent> {
  constructor(
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository
  ) {}

  async commit(event: AppInstalledEvent): Promise<void> {
    console.log("AppInstalledEventDelta.commit", event);
    const [eventRow, found] = await this.findEvent(event);
    if (Boolean(found)) {
      console.log("Already committed", event);
    } else {
      const applicationRow = new Application();
      applicationRow.id = event.proxyAddress;
      applicationRow.appId = event.appId;
      applicationRow.organisationId = event.organisationAddress;

      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        const savedApplication = await entityManager.save(applicationRow);
        console.log("Saved application", savedApplication);
        const savedEvent = await entityManager.save(eventRow);
        console.log("Saved event", savedEvent);
      });
    }
  }

  async revert(event: AppInstalledEvent): Promise<void> {
    console.log("AppInstalledEventDelta.revert", event);
    const [eventRow, found] = await this.findEvent(event);
    if (found) {
      const applicationRow = await this.applicationRepository.byId(event.proxyAddress);
      if (applicationRow) {
        const writing = await this.connectionFactory.writing();
        await writing.transaction(async entityManager => {
          await entityManager.delete(Application, { id: event.proxyAddress });
          console.log("Deleted application", applicationRow);
          await entityManager.delete(Event, { id: found.id });
          console.log("Deleted event", found);
        });
      } else {
        console.log("Can not find organisation", event);
      }
    } else {
      console.log("Can not find event", event);
    }
  }

  async findEvent(event: AppInstalledEvent) {
    const eventRow = new Event();
    eventRow.id = new UUID();
    eventRow.platform = event.platform;
    eventRow.blockHash = event.blockHash;
    eventRow.blockId = BigInt(event.blockNumber);
    eventRow.payload = event;
    const found = await this.eventRepository.findSame(eventRow);
    return [eventRow, found];
  }
}
