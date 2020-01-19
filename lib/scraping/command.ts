import { ScrapingEvent } from "./events/scraping-event";
import { BadRequestError } from "../shared/errors";

export enum COMMAND_KIND {
  COMMIT = "COMMIT",
  REVERT = "REVERT"
}

export namespace COMMAND_KIND {
  export function fromString(s: string): COMMAND_KIND {
    switch (s) {
      case COMMAND_KIND.COMMIT:
        return COMMAND_KIND.COMMIT;
      case COMMAND_KIND.REVERT:
        return COMMAND_KIND.REVERT;
      default:
        throw new BadRequestError(`Unexpected command kind ${s}`);
    }
  }
}

export interface CommitCommand {
  kind: COMMAND_KIND.COMMIT;
  event: ScrapingEvent;
}

export interface StoredEvent {
  eventId: string;
  blockNumber: number;
  blockHash: string;
}

export interface RevertCommand extends StoredEvent {
  kind: COMMAND_KIND.REVERT;
}

export type Command = CommitCommand | RevertCommand;
