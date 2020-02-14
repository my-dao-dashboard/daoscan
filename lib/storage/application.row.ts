import { Column, Entity, PrimaryColumn, ValueTransformer } from "typeorm";
import { bigintTransformer } from "./bigint.transformer";

export const addressTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue.toLowerCase(),
  from: (databaseValue: string): string => databaseValue.toLowerCase()
};

@Entity("applications")
export class Application {
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
}
