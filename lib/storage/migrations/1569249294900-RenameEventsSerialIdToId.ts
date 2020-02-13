/* istanbul ignore file */
import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameEventsSerialIdToId1569249294900 implements MigrationInterface {
  readonly name = "RenameEventsSerialIdToId1569249294900";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("events", "serialId", "id");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("events", "id", "serialId");
  }
}
