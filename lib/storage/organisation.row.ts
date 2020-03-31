import { Column, Entity, PrimaryColumn } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { bigintTransformer } from "./transformers/bigint.transformer";
import { dateTimeTransformer } from "./transformers/date-time.transformer";
import { DateTime } from "luxon";

@Entity("organisations")
export class Organisation {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  name: string;

  @Column()
  // @ts-ignore
  platform: PLATFORM;

  @Column()
  // @ts-ignore
  address: string;

  @Column("timestamp", { transformer: dateTimeTransformer })
  // @ts-ignore
  createdAt: DateTime;
}
