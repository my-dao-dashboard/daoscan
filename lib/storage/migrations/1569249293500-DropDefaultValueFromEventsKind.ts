/* istanbul ignore file */
import { MigrationInterface, QueryRunner } from "typeorm";

export class DropDefaultValueFromEventsKind1569249293500 implements MigrationInterface {
  readonly name = "DropDefaultValueFromEventsKind1569249293500";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "kind" DROP DEFAULT`);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "kind" SET DEFAULT 'NONE'`);
  }
}
