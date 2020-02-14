/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddChangeToHistory1569249296200 implements MigrationInterface {
  readonly name = "AddChangeToHistory1569249296200";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "history",
      new TableColumn({
        name: "delta",
        type: "jsonb",
        isNullable: true,
        isUnique: false
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("history", "delta");
  }
}
