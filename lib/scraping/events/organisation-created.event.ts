import { PLATFORM } from "../../domain/platform";
import { IScrapingEvent, SCRAPING_EVENT_KIND } from "./scraping-event.interface";

export interface OrganisationCreatedEventProps {
  name: string;
  address: string;
  platform: PLATFORM;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  txid: string;
}

export class OrganisationCreatedEvent implements IScrapingEvent {
  readonly kind = SCRAPING_EVENT_KIND.ORGANISATION_CREATED;

  constructor(private readonly props: OrganisationCreatedEventProps) {}

  get name(): string {
    return this.props.name;
  }

  get address() {
    return this.props.address;
  }

  get blockHash(): string {
    return this.props.blockHash;
  }

  get blockNumber(): number {
    return this.props.blockNumber;
  }

  get platform(): PLATFORM {
    return this.props.platform;
  }

  get timestamp(): number {
    return this.props.timestamp;
  }

  get txid(): string {
    return this.props.txid;
  }

  toJSON() {
    return {
      kind: this.kind,
      name: this.name,
      address: this.address,
      platform: this.platform,
      blockNumber: this.blockNumber,
      blockHash: this.blockHash,
      timestamp: this.timestamp,
      txid: this.txid
    };
  }
}
