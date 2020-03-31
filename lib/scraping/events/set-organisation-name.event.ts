import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { EventRecord } from "../../storage/event.record";
import { OrganisationStorage } from "../../storage/organisation.storage";
import { ConnectionFactory } from "../../storage/connection.factory";
import { HistoryRepository } from "../../storage/history.repository";
import { HistoryRecord } from "../../storage/history.record";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { OrganisationRecord } from "../../storage/organisation.record";
import { EventRepository } from "../../storage/event.repository";

export interface SetOrganisationNameEventProps {
  blockNumber: number;
  blockHash: string;
  platform: PLATFORM;
  timestamp: number;
  txid: string;

  name: string;
  address: string;
}

export class SetOrganisationNameEvent implements IScrapingEvent {
  readonly kind = SCRAPING_EVENT_KIND.SET_ORGANISATION_NAME;
  readonly platform = this.props.platform;
  readonly blockHash = this.props.blockHash;
  readonly blockNumber = this.props.blockNumber;
  readonly timestamp = this.props.timestamp;
  readonly address = this.props.address.toLowerCase();
  readonly txid = this.props.txid;
  readonly name = this.props.name;

  constructor(
    private readonly props: SetOrganisationNameEventProps,
    private readonly organisationRepository: OrganisationStorage,
    private readonly connectionFactory: ConnectionFactory,
    private readonly historyRepository: HistoryRepository,
    private readonly eventRepository: EventRepository
  ) {}

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();
    const organisation = await this.findOrBuildOrganisationRow(eventRow);
    const writing = await this.connectionFactory.writing();

    const history = new HistoryRecord();
    history.resourceKind = RESOURCE_KIND.ORGANISATION;
    history.delta = {
      before: {
        name: organisation.name,
        isPresent: !!organisation.id
      },
      after: {
        name: this.name
      }
    };

    await writing.transaction(async eventManager => {
      const savedEvent = await eventManager.save(eventRow);
      console.log("Saved event", savedEvent);
      organisation.name = this.name;
      const savedOrganisation = await eventManager.save(organisation);
      history.resourceId = savedOrganisation.id;
      history.eventId = savedEvent.id;
      const savedHistory = await eventManager.save(history);
      console.log("Saved history", savedHistory);
    });
  }

  async revert(): Promise<void> {
    const eventRow = this.buildEventRow();
    const found = await this.eventRepository.findSame(eventRow);
    if (found) {
      const historyRows = await this.historyRepository.allByEventIdAndKind(found.id, RESOURCE_KIND.ORGANISATION);
      const writing = await this.connectionFactory.writing();
      await writing.transaction(async entityManager => {
        await entityManager.delete(EventRecord, found);
        for (let h of historyRows) {
          if (h.delta) {
            if (h.delta.before.isPresent) {
              const organisation = await entityManager.findOne(OrganisationRecord, { id: h.resourceId });
              if (organisation) {
                organisation.name = h.delta.before.name;
                await entityManager.save(organisation);
              }
            } else {
              await entityManager.delete(OrganisationRecord, { id: h.resourceId });
            }
          }
          await entityManager.delete(HistoryRecord, h);
        }
      });
    }
  }

  async findOrBuildOrganisationRow(event: EventRecord) {
    const foundOrganisation = await this.organisationRepository.byAddress(this.address);
    if (foundOrganisation) {
      return foundOrganisation;
    } else {
      const organisationRow = new OrganisationRecord();
      organisationRow.name = this.name;
      organisationRow.address = this.address;
      organisationRow.platform = this.platform;
      organisationRow.createdAt = event.timestamp;
      return organisationRow;
    }
  }

  buildEventRow() {
    const eventRow = new EventRecord();
    eventRow.platform = this.platform;
    eventRow.blockHash = this.blockHash;
    eventRow.blockId = BigInt(this.blockNumber);
    eventRow.payload = this;
    eventRow.timestamp = new Date(this.timestamp * 1000);
    eventRow.organisationAddress = this.address;
    eventRow.kind = this.kind;
    return eventRow;
  }

  toJSON(): any {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
