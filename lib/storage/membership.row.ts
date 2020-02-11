import { Column, Entity, PrimaryColumn } from "typeorm";
import { UUID } from "./uuid";
import { uuidTransformer } from "./event.row";
import { MEMBERSHIP_KIND } from "./membership.kind";
import { bigintTransformer } from "./bigint.transformer";

@Entity("memberships")
export class Membership {
  @PrimaryColumn("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  organisationAddress: string;

  @Column()
  // @ts-ignore
  accountAddress: string; // member address

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
