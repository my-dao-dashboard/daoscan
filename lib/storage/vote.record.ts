import { Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./transformers/bigint.transformer";
import { VOTE_DECISION } from "../domain/vote-decision";

@Entity("votes")
export class VoteRecord {
  @PrimaryColumn("bigint", { transformer: bigintTransformer, generated: true })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  proposalIndex: number;

  @Column()
  // @ts-ignore
  organisationAddress: string;

  @Column()
  // @ts-ignore
  voter: string;

  @Column({ type: "enum", enum: VOTE_DECISION })
  // @ts-ignore
  decision: VOTE_DECISION;

  @Column()
  // @ts-ignore
  createdAt: Date;
}
