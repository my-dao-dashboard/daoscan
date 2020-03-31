import { Column, Entity, PrimaryColumn } from "typeorm";
import { MEMBERSHIP_KIND } from "./membership.kind";
import { bigintTransformer } from "./transformers/bigint.transformer";

@Entity("memberships")
export class MembershipRecord {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  organisationAddress: string;

  @Column()
  // @ts-ignore
  accountAddress: string; // member address

  @Column("numeric", { transformer: bigintTransformer })
  // @ts-ignore
  balanceDelta: bigint; // member address

  @Column()
  // @ts-ignore
  kind: MEMBERSHIP_KIND;
}
