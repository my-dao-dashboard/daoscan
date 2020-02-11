/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddKindToEvents1569249293400 implements MigrationInterface {
  readonly name = "AddKindToEvents1569249293400";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        name: "kind",
        type: "VARCHAR(256)",
        isNullable: false,
        isUnique: false,
        default: "'NONE'"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("events", "kind");
  }
}
