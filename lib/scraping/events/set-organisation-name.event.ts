import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { Event } from "../../storage/event.row";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { HistoryRepository } from "../../storage/history.repository";
import { History } from "../../storage/history.row";
import { RESOURCE_KIND } from "../../storage/resource.kind";
import { Organisation } from "../../storage/organisation.row";
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
  readonly address = this.props.address;
  readonly txid = this.props.txid;
  readonly name = this.props.name;

  constructor(
    private readonly props: SetOrganisationNameEventProps,
    private readonly organisationRepository: OrganisationRepository,
    private readonly connectionFactory: ConnectionFactory,
    private readonly historyRepository: HistoryRepository,
    private readonly eventRepository: EventRepository
  ) {}

  async commit(): Promise<void> {
    const eventRow = this.buildEventRow();
    const organisation = await this.findOrBuildOrganisationRow();
    const writing = await this.connectionFactory.writing();

    const history = new History();
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
        await entityManager.delete(Event, found);
        for (let h of historyRows) {
          if (h.delta) {
            if (h.delta.before.isPresent) {
              const organisation = await entityManager.findOne(Organisation, { id: h.resourceId });
              if (organisation) {
                organisation.name = h.delta.before.name;
                await entityManager.save(organisation);
              }
            } else {
              await entityManager.delete(Organisation, { id: h.resourceId });
            }
          }
          await entityManager.delete(History, h);
        }
      });
    }
  }

  async findOrBuildOrganisationRow() {
    const foundOrganisation = await this.organisationRepository.byAddress(this.address);
    if (foundOrganisation) {
      return foundOrganisation;
    } else {
      const organisationRow = new Organisation();
      organisationRow.name = this.name;
      organisationRow.address = this.address;
      organisationRow.platform = this.platform;
      return organisationRow;
    }
  }

  buildEventRow() {
    const eventRow = new Event();
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
