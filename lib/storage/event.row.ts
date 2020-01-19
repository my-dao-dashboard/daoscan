import { Column, Entity, PrimaryColumn } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { ScrapingEvent } from "../scraping/events/scraping-event";
import { bigintTransformer } from "./bigint.transformer";

@Entity("events")
export class Event {
  @PrimaryColumn()
  // @ts-ignore
  id: string;

  @Column("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  blockId: bigint;

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
