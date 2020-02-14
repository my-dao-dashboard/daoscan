import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { IScrapingEvent } from "./scraping-event.interface";
import { Event } from "../../storage/event.row";
import { EventRepository } from "../../storage/event.repository";
import { Application } from "../../storage/application.row";
import { ConnectionFactory } from "../../storage/connection.factory";
import { ApplicationRepository } from "../../storage/application.repository";
import { RESOURCE_KIND } from "../../storage/resource.kind";

export interface AppInstalledEventProps {
  blockNumber: number;
  blockHash: string;
  platform: PLATFORM;
  timestamp: number;
  txid: string;
  organisationAddress: string;
  appId: string;
  proxyAddress: string;
}

export class AppInstalledEvent implements IScrapingEvent {
  readonly kind = SCRAPING_EVENT_KIND.APP_INSTALLED;
  private readonly props: AppInstalledEventProps;

  constructor(
    props: AppInstalledEventProps,
    private readonly eventRepository: EventRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly connectionFactory: ConnectionFactory
  ) {
    this.props = props;
  }

  get platform() {
    return this.props.platform;
  }

  get appId() {
    return this.props.appId;
  }

  get proxyAddress() {
    return this.props.proxyAddress;
  }

  get organisationAddress() {
    return this.props.organisationAddress;
  }

  get txid() {
    return this.props.txid;
  }

  get blockHash() {
    return this.props.blockHash;
  }

  get blockNumber() {
    return this.props.blockNumber;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  async commit(): Promise<void> {
    console.log("Committing event", this.toJSON());
    const [eventRow, found] = await this.findRow();
    const applicationRow = new Application();
    applicationRow.address = this.proxyAddress;
    applicationRow.appId = this.appId;
    applicationRow.organisationAddress = this.organisationAddress;

    const writing = await this.connectionFactory.writing();
    await writing.transaction(async entityManager => {
      const savedEvent = await entityManager.save(eventRow);
      console.log("Saved event", savedEvent);
      applicationRow.eventId = savedEvent.id;
      const savedApplication = await entityManager.save(applicationRow);
      console.log("Saved application", savedApplication);
    });
  }

  async revert(): Promise<void> {
    console.log("AppInstalledEvent.revert", this.toJSON());
    const [eventRow, found] = await this.findRow();
    if (found) {
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await entityManager.delete(Event, found);
        console.log("Deleted event", found);
        const deleteResult = await entityManager.delete(Application, { eventId: found.id });
        console.log(`Deleted ${deleteResult.affected} applications`);
      });
    } else {
      console.log("Can not find event", this);
    }
  }

  async findRow(): Promise<[Event, Event | undefined]> {
    const eventRow = new Event();
    eventRow.platform = this.platform;
    eventRow.blockHash = this.blockHash;
    eventRow.blockId = BigInt(this.blockNumber);
    eventRow.payload = this;
    eventRow.timestamp = new Date(this.timestamp * 1000);
    eventRow.organisationAddress = this.organisationAddress;
    eventRow.kind = this.kind;

    const found = await this.eventRepository.findSame(eventRow);
    return [eventRow, found];
  }

  toJSON() {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
