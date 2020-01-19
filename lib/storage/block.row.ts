import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import { bigintTransformer } from "./bigint.transformer";

@Entity("blocks")
export class Block {
  @PrimaryColumn("bigint", { transformer: bigintTransformer })
  // @ts-ignore
  id: bigint;

  @Column()
  // @ts-ignore
  hash: string;

  @BeforeInsert()
  @BeforeUpdate()
  private setHashToLowerCase() {
    this.hash = this.hash.toLowerCase();
  }
}
