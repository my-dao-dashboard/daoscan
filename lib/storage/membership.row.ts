import { Column, Entity, PrimaryColumn } from "typeorm";
import { UUID } from "./uuid";
import { uuidTransformer } from "./event.row";
import { MEMBERSHIP_KIND } from "./membership.kind";
import { bigintTransformer } from "./bigint.transformer";

@Entity()
export class Membership {
  @PrimaryColumn("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  id: UUID;

  @Column()
  // @ts-ignore
  organisationId: string;

  @Column()
  // @ts-ignore
  accountId: string; // member address

  @Column("varchar", { transformer: uuidTransformer })
  // @ts-ignore
  eventId: UUID; // member address

  @Column("numeric", { transformer: bigintTransformer })
  // @ts-ignore
  balanceDelta: bigint; // member address

  @Column()
  // @ts-ignore
  kind: MEMBERSHIP_KIND;
}
