/* istanbul ignore file */
import { MigrationInterface, QueryRunner } from "typeorm";

export class DropDefaultValueFromEvents1569249293100 implements MigrationInterface {
  readonly name = "DropDefaultValueFromEvents1569249293100";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "timestamp" DROP DEFAULT`);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "timestamp" SET DEFAULT '1970-01-01'`);
  }
}
