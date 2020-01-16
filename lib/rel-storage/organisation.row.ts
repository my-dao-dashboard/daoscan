import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("organisations")
export class OrganisationRow {
  @PrimaryColumn()
  // @ts-ignore
  id: number;

  @Column()
  // @ts-ignore
  platform: string;

  @Column()
  // @ts-ignore
  name: string;

  @Column()
  // @ts-ignore
  address: string;
}
