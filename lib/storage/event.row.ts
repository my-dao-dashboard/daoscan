import { Column, Entity, PrimaryColumn, ValueTransformer } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { ScrapingEvent } from "../scraping/events/scraping-event";
import { bigintTransformer } from "./bigint.transformer";
import { UUID } from "./uuid";

export const uuidTransformer: ValueTransformer = {
  to: (entityValue: UUID) => entityValue.toString(),
  from: (databaseValue: string): UUID => new UUID(databaseValue)
};

@Entity("events")
export class Event {
  @PrimaryColumn("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  id: UUID;

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
