/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

const COLUMN = new TableColumn({
  name: "eventId",
  type: "BIGINT",
  isNullable: false,
  isUnique: false,
  default: 0
});

export class AddEventIdsBack1569249295000 implements MigrationInterface {
  readonly name = "AddEventIdsBack1569249295000";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn("applications", COLUMN);
    await queryRunner.addColumn("delegates", COLUMN);
    await queryRunner.addColumn("memberships", COLUMN);
    await queryRunner.addColumn("organisations", COLUMN);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("applications", "eventId");
    await queryRunner.dropColumn("delegates", "eventId");
    await queryRunner.dropColumn("memberships", "eventId");
    await queryRunner.dropColumn("organisations", "eventId");
  }
}
