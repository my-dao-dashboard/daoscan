import { ScrapingEvent } from "./event";

export enum KIND {
  COMMIT = "COMMIT",
  REVERT = "REVERT"
}

export interface CommitCommand {
  kind: KIND.COMMIT;
  event: ScrapingEvent;
}

export interface RevertCommand {
  kind: KIND.REVERT;
  id: number;
  blockNumber: number;
  blockHash: string;
}

export type Command = CommitCommand | RevertCommand;
