import { ScrapingEvent } from "./events/scraping-event";
import { COMMAND_KIND } from "./command.kind";

export class CommitCommand {
  readonly kind = COMMAND_KIND.COMMIT;
  readonly event: ScrapingEvent;

  constructor(event: ScrapingEvent) {
    this.event = event;
  }

  toJSON() {
    return {
      kind: this.kind,
      event: this.event
    };
  }
}

export class RevertCommand {
  readonly kind = COMMAND_KIND.REVERT;
  readonly eventId: string;

  constructor(eventId: string) {
    this.eventId = eventId;
  }

  toJSON() {
    return {
      kind: this.kind,
      eventId: this.eventId
    };
  }
}

export type Command = CommitCommand | RevertCommand;
