import { Column, Entity, PrimaryColumn, ValueTransformer } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { ScrapingEvent } from "../scraping/events/scraping-event";
import { bigintTransformer } from "./bigint.transformer";
import { UUID } from "./uuid";
import { SCRAPING_EVENT_KIND } from "../scraping/events/scraping-event.kind";

export const uuidTransformer: ValueTransformer = {
  to: (entityValue: UUID) => entityValue.toString(),
  from: (databaseValue: string): UUID => new UUID(databaseValue)
};

@Entity("events")
export class Event {
  @Column("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  id: UUID;

  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  serialId: bigint;

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
