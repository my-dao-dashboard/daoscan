/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class DropEventIdFromDelegates1569249294600 implements MigrationInterface {
  readonly name = "DropEventIdFromDelegates1569249294600";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("delegates", "eventId");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "delegates",
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
