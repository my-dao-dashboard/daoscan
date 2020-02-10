import { Column, Entity, PrimaryColumn } from "typeorm";
import { UUID } from "./uuid";
import { uuidTransformer } from "./event.row";

@Entity("delegates")
export class Delegate {
  @PrimaryColumn("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  eventId: UUID;

  @Column()
  // @ts-ignore
  address: string; // delegate address

  @Column()
  // @ts-ignore
  delegateFor: string;

  @Column()
  // @ts-ignore
  organisationAddress: string;
}
