/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AdjustMembershipsName1569249292000 implements MigrationInterface {
  readonly name = "AdjustMembershipsName1569249292000";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameTable("memberhsips", "memberships");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameTable("memberships", "memberhsips");
  }
}
