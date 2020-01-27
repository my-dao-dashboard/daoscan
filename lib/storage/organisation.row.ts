import { Column, Entity, PrimaryColumn } from "typeorm";
import { uuidTransformer } from "./event.row";
import { UUID } from "./uuid";

@Entity("organisations")
export class Organisation {
  @PrimaryColumn("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  id: UUID; // event id

  @Column()
  // @ts-ignore
  name: string;

  @Column()
  // @ts-ignore
  platform: string;

  @Column()
  // @ts-ignore
  address: string;
}
