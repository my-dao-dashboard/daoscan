import { Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./transformers/bigint.transformer";
import { addressTransformer } from "./transformers/address.transformer";

@Entity("applications")
export class ApplicationRecord {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  organisationAddress: string;

  @Column()
  // @ts-ignore
  appId: string;

  @Column("varchar", { transformer: addressTransformer })
  // @ts-ignore
  address: string;

  @Column()
  // @ts-ignore
  name: string;
}
