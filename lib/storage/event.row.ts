import { Column, Entity, PrimaryColumn } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { ScrapingEvent } from "../scraping/events/scraping-event";

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

  @Column({ type: "simple-json" })
  // @ts-ignore
  payload: ScrapingEvent;
}
