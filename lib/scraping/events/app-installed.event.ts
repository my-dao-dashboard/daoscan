import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { PLATFORM } from "../../domain/platform";
import { IScrapingEvent } from "./scraping-event.interface";

interface Props {
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
  private readonly props: Props;

  constructor(props: Props) {
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

  toJSON() {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
