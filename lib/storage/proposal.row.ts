import { Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./bigint.transformer";
import { PROPOSAL_STATUS } from "../domain/proposal";

@Entity("proposals")
export class Proposal {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  index: number;

  @Column()
  // @ts-ignore
  organisationAddress: string;

  @Column()
  // @ts-ignore
  proposer: string;

  @Column({ type: "jsonb" })
  // @ts-ignore
  payload: any;

  @Column({ type: "enum", enum: PROPOSAL_STATUS })
  // @ts-ignore
  status: PROPOSAL_STATUS;

  @Column()
  // @ts-ignore
  createdAt: Date;
}
