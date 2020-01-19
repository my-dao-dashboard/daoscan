import { ScrapingEvent } from "./scraping-event";

export interface Delta<Event extends ScrapingEvent> {
  commit(event: Event): Promise<void>;
  revert(event: Event): Promise<void>;
}
