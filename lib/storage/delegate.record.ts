import { Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./transformers/bigint.transformer";

@Entity("delegates")
export class DelegateRecord {
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
