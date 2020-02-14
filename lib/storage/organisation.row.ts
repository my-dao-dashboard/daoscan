import { Column, Entity, PrimaryColumn } from "typeorm";
import { PLATFORM } from "../domain/platform";
import { bigintTransformer } from "./bigint.transformer";

@Entity("organisations")
export class Organisation {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  eventId: bigint;

  @Column()
  // @ts-ignore
  name: string;

  @Column()
  // @ts-ignore
  platform: PLATFORM;

  @Column()
  // @ts-ignore
  address: string;
}
