/* istanbul ignore file */
import { MigrationInterface, QueryRunner } from "typeorm";

export class ApplicationIdIsEventId1569249293600 implements MigrationInterface {
  readonly name = "ApplicationIdIsEventId1569249293600";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("applications", "id", "eventId");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("applications", "eventId", "id");
  }
}
