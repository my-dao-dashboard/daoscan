import { Column, Entity, PrimaryColumn } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { SCRAPING_EVENT_KIND, ScrapingEvent } from "../scraping/events/event";

@Entity("events")
export class Event {
  @PrimaryColumn()
  // @ts-ignore
  id: string;

  @Column()
  // @ts-ignore
  blockId: number;

  @Column()
  // @ts-ignore
  blockHash: string;

  @Column({ type: "enum", enum: PLATFORM })
  // @ts-ignore
  platform: PLATFORM;

  @Column({ type: "enum", enum: SCRAPING_EVENT_KIND })
  // @ts-ignore
  kind: SCRAPING_EVENT_KIND;

  @Column({ type: "simple-json" })
  // @ts-ignore
  payload: ScrapingEvent;
}
