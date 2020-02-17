import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { NotImplementedError } from "../../shared/errors";
import { PLATFORM } from "../../domain/platform";
import {Proposal} from "../../storage/proposal.row";
import {History} from "../../storage/history.row";
import {RESOURCE_KIND} from "../../storage/resource.kind";
import {Event} from "../../storage/event.row";

export enum VOTE_DECISION {
  ABSTAIN = "ABSTAIN",
  YES = "YES",
  NO = "NO"
}

export namespace VOTE_DECISION {
  export function fromNumber(vote: number) {
    switch (vote) {
      case 0:
        return VOTE_DECISION.ABSTAIN;
      case 1:
        return VOTE_DECISION.YES;
      case 2:
        return VOTE_DECISION.NO;
      default:
        throw new Error(`Unknown vote ${vote} for Moloch contract`);
    }
  }
}

interface SubmitVoteEventProps {
  platform: PLATFORM;
  organisationAddress: string;
  voter: string;
  proposalIndex: number;
  timestamp: number;
  txid: string;
  blockNumber: number;
  blockHash: string;
  decision: VOTE_DECISION;
}

export class SubmitVoteEvent implements IScrapingEvent, SubmitVoteEventProps {
  readonly kind = SCRAPING_EVENT_KIND.SUBMIT_VOTE;
  readonly organisationAddress = this.props.organisationAddress;
  readonly voter = this.props.voter;
  readonly proposalIndex = this.props.proposalIndex;
  readonly timestamp = this.props.timestamp;
  readonly txid = this.props.txid;
  readonly blockNumber = this.props.blockNumber;
  readonly blockHash = this.props.blockHash;
  readonly platform = this.props.platform;
  readonly decision = this.props.decision;

  constructor(readonly props: SubmitVoteEventProps) {}

  async commit(): Promise<void> {
    throw new NotImplementedError("SubmitVoteEvent.commit");
  }

  async revert(): Promise<void> {
    throw new NotImplementedError("SubmitVoteEvent.revert");
  }

  toJSON(): any {
    return {
      ...this.props,
      kind: this.kind
    };
  }
}
