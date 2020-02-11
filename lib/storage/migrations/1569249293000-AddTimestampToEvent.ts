/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddTimestampToEvent1569249293000 implements MigrationInterface {
  readonly name = "AddTimestampToEvent1569249293000";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        name: "timestamp",
        type: "TIMESTAMP",
        isNullable: false,
        isUnique: false,
        default: "CURRENT_TIMESTAMP"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("events", "timestamp");
  }
}
