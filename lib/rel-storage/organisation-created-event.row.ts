import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("organisation_created_events")
export class OrganisationCreatedEventRow {
  @PrimaryColumn()
  // @ts-ignore
  id: number;

  @Column()
  // @ts-ignore
  blockId: number;

  @Column()
  // @ts-ignore
  platform: string;

  @Column()
  // @ts-ignore
  name: string;

  @Column()
  // @ts-ignore
  address: string;

  @Column()
  // @ts-ignore
  txid: string;
}
