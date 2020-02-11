import { Column, Entity, PrimaryColumn, ValueTransformer } from "typeorm";
import { uuidTransformer } from "./event.row";
import { UUID } from "./uuid";
import { bigintTransformer } from "./bigint.transformer";

export const addressTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue.toLowerCase(),
  from: (databaseValue: string): string => databaseValue.toLowerCase()
};

@Entity("applications")
export class Application {
  @Column("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  eventId: UUID;

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
