import { Column, Entity, PrimaryColumn } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { ScrapingEvent } from "../scraping/events/scraping-event";
import { bigintTransformer } from "./transformers/bigint.transformer";
import { SCRAPING_EVENT_KIND } from "../scraping/events/scraping-event.kind";

@Entity("events")
export class EventRecord {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

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

  @Column()
  // @ts-ignore
  timestamp: Date;

  @Column()
  // @ts-ignore
  organisationAddress: string;

  @Column({ type: "enum", enum: SCRAPING_EVENT_KIND })
  // @ts-ignore
  kind: SCRAPING_EVENT_KIND;
}
