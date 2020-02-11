/* istanbul ignore file */
import { MigrationInterface, QueryRunner } from "typeorm";

export class DropDefaultValueFromEventsOrganisationAddress1569249293200 implements MigrationInterface {
  readonly name = "DropDefaultValueFromEventsOrganisationAddress1569249293200";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "organisationAddress" DROP DEFAULT`);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "organisationAddress" SET DEFAULT '0x0000000000000000000000000000000000000000'`);
  }
}
