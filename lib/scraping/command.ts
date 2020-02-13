import { ScrapingEvent } from "./events/scraping-event";
import { COMMAND_KIND } from "./command.kind";
import { ScrapingEventFactory } from "./events/scraping-event.factory";

interface GenericCommand {
  readonly kind: COMMAND_KIND;
  toJSON(): any;
  execute(): Promise<void>;
}

export class CommitCommand implements GenericCommand {
  readonly kind = COMMAND_KIND.COMMIT;
  readonly event: ScrapingEvent;

  constructor(event: ScrapingEvent) {
    this.event = event;
  }

  async execute(): Promise<void> {
    const event = this.event;
    console.log("Committing event", event.toJSON());
    await event.commit();
  }

  toJSON() {
    return {
      kind: this.kind,
      event: this.event
    };
  }
}

export class RevertCommand implements GenericCommand {
  readonly kind = COMMAND_KIND.REVERT;
  readonly eventId: string;

  constructor(eventId: string, private readonly scrapingEventFactory: ScrapingEventFactory) {
    this.eventId = eventId;
  }

  async execute(): Promise<void> {
    console.log("Trying to revert event", this.toJSON());
    const event = await this.scrapingEventFactory.fromStorage(BigInt(this.eventId));
    if (event) {
      await event.revert();
    } else {
      console.log(`No event found`, this.eventId);
    }
  }

  toJSON() {
    return {
      kind: this.kind,
      eventId: this.eventId
    };
  }
}

export type Command = CommitCommand | RevertCommand;
