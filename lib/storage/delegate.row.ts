import { Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./bigint.transformer";

@Entity("delegates")
export class Delegate {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  eventId: bigint;

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
