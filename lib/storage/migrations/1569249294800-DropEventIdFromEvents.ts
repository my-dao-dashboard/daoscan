/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DropEventIdFromEvents1569249294800 implements MigrationInterface {
  readonly name = "DropEventIdFromEvents1569249294800";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("events", "id");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        name: "id",
        type: "varchar(400)",
        isNullable: false,
        isUnique: true,
        default: "00000000-0000-0000-0000-000000000000"
      })
    );
  }
}
