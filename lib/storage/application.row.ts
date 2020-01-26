import { Column, Entity, PrimaryColumn, ValueTransformer } from "typeorm";

export const addressTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue.toLowerCase(),
  from: (databaseValue: string): string => databaseValue.toLowerCase()
};

@Entity("applications")
export class Application {
  @PrimaryColumn("varchar", { transformer: addressTransformer })
  // @ts-ignore
  id: string;

  @Column()
  // @ts-ignore
  organisationId: string;

  @Column()
  // @ts-ignore
  appId: string;
}
