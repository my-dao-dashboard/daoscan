/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DropEventIdFromMemberships1569249294700 implements MigrationInterface {
  readonly name = "DropEventIdFromMemberships1569249294700";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("memberships", "eventId");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "memberships",
      new TableColumn({
        name: "eventId",
        type: "varchar(400)",
        isNullable: false,
        isUnique: true,
        default: "00000000-0000-0000-0000-000000000000"
      })
    );
  }
}
