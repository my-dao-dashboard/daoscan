/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSerialIdToEvents1569249293800 implements MigrationInterface {
  readonly name = "AddSerialIdToEvents1569249293800";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        name: "serialId",
        type: "BIGSERIAL",
        isPrimary: true,
        isNullable: false,
        isUnique: true
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("events", "serialId");
  }
}
