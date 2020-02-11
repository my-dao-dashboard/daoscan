/* istanbul ignore file */
import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganisationIdIsEventId1569249293700 implements MigrationInterface {
  readonly name = "OrganisationIdIsEventId1569249293700";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("organisations", "id", "eventId");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("organisations", "eventId", "id");
  }
}
