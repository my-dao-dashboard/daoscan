import { IScrapingEvent } from "./scraping-event.interface";
import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";
import { NotImplementedError } from "../../shared/errors";

interface SubmitVoteEventProps {}

export class SubmitVoteEvent implements IScrapingEvent, SubmitVoteEventProps {
  readonly kind = SCRAPING_EVENT_KIND.SUBMIT_VOTE;

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
