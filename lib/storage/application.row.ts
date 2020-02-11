import { Column, Entity, PrimaryColumn, ValueTransformer } from "typeorm";
import { uuidTransformer } from "./event.row";
import { UUID } from "./uuid";

export const addressTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue.toLowerCase(),
  from: (databaseValue: string): string => databaseValue.toLowerCase()
};

@Entity("applications")
export class Application {
  @PrimaryColumn("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  eventId: UUID;

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
