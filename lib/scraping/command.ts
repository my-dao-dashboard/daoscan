import { ScrapingEvent } from "./events/event";
import { BadRequestError } from "../shared/errors";

export enum KIND {
  COMMIT = "COMMIT",
  REVERT = "REVERT"
}

export namespace KIND {
  export function fromString(s: string): KIND {
    switch (s) {
      case KIND.COMMIT:
        return KIND.COMMIT;
      case KIND.REVERT:
        return KIND.REVERT;
      default:
        throw new BadRequestError(`Unexpected command kind ${s}`);
    }
  }
}

export interface CommitCommand {
  kind: KIND.COMMIT;
  event: ScrapingEvent;
}

export interface StoredEvent {
  eventId: string;
  blockNumber: number;
  blockHash: string;
}

export interface RevertCommand extends StoredEvent {
  kind: KIND.REVERT;
}

export type Command = CommitCommand | RevertCommand;
