import { Column, Entity, PrimaryColumn } from "typeorm";
import { uuidTransformer } from "./event.row";
import { UUID } from "./uuid";
import { PLATFORM } from "../domain/platform";
import { bigintTransformer } from "./bigint.transformer";

@Entity("organisations")
export class Organisation {
  @Column("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  eventId: UUID; // event id

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
}
