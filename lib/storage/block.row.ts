import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./bigint.transformer";
import { ExtendedBlock } from "../services/ethereum.service";

@Entity("blocks")
export class Block {
  @PrimaryColumn("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  hash: string;

  @Column({ type: "simple-json" })
  // @ts-ignore
  body: ExtendedBlock | null;

  @BeforeInsert()
  @BeforeUpdate()
  private setHashToLowerCase() {
    this.hash = this.hash.toLowerCase();
  }
}
