import { Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./bigint.transformer";
import { RESOURCE_KIND } from "./resource.kind";

interface Delta {
  before: any;
  after: any;
}

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

  @Column({ type: "jsonb" })
  // @ts-ignore
  delta: Delta | null;
}
