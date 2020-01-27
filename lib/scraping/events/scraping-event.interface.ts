import { SCRAPING_EVENT_KIND } from "./scraping-event.kind";

export interface IScrapingEvent {
  readonly kind: SCRAPING_EVENT_KIND;
  toJSON(): any;
  commit(): Promise<void>;
  revert(): Promise<void>;
}
