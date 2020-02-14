import { Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./bigint.transformer";
import { PLATFORM } from "../domain/platform";
import { ScrapingEvent } from "../scraping/events/scraping-event";
import { SCRAPING_EVENT_KIND } from "../scraping/events/scraping-event.kind";
import { RESOURCE_KIND } from "./resource.kind";

@Entity("history")
export class History {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  eventId: bigint;

  @Column("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  resourceId: bigint;

  @Column({ type: "enum", enum: RESOURCE_KIND })
  // @ts-ignore
  resourceKind: RESOURCE_KIND;
}
