import { Column, Entity, PrimaryColumn } from "typeorm";
import { UUID } from "./uuid";
import { uuidTransformer } from "./event.row";
import { bigintTransformer } from "./bigint.transformer";

@Entity("delegates")
export class Delegate {
  @Column("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  eventId: UUID;

  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  address: string; // delegate address

  @Column()
  // @ts-ignore
  delegateFor: string;

  @Column()
  // @ts-ignore
  organisationAddress: string;
}
