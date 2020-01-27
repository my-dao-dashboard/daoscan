import { Column, Entity, PrimaryColumn } from "typeorm";
import { uuidTransformer } from "./event.row";
import { UUID } from "./uuid";

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

  @Column("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  eventId: UUID;
}
