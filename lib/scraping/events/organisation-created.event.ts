import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { IScrapingEvent } from "./scraping-event.interface";

interface Props {
  blockNumber: number;
  blockHash: string;
  platform: PLATFORM;
  timestamp: number;
  txid: string;
  name: string;
  address: string;
}

export class OrganisationCreatedEvent implements IScrapingEvent {
  readonly kind = SCRAPING_EVENT_KIND.ORGANISATION_CREATED;
  private readonly props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  get platform() {
    return this.props.platform;
  }

  get blockHash() {
    return this.props.blockHash;
  }

  get blockNumber() {
    return this.props.blockNumber;
  }

  get address() {
    return this.props.address;
  }

  get name() {
    return this.props.name;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  get txid() {
    return this.props.txid;
  }

  toJSON() {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
