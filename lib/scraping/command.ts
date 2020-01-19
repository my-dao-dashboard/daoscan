import { ScrapingEvent } from "./events/scraping-event";
import { COMMAND_KIND } from "./command.kind";

export interface CommitCommand {
  kind: COMMAND_KIND.COMMIT,
  event: ScrapingEvent
}

export interface RevertCommand {
  kind: COMMAND_KIND.REVERT,
  eventId: string
}

export type Command = CommitCommand | RevertCommand;
