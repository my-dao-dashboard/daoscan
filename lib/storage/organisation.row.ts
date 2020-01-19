import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("organisations")
export class Organisation {
  @PrimaryColumn()
  // @ts-ignore
  id: string;

  @Column()
  // @ts-ignore
  name: string;

  @Column()
  // @ts-ignore
  platform: string;
}
