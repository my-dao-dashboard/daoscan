/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class StoreBlockBody1569249292800 implements MigrationInterface {
  readonly name = "StoreBlockBody1569249292800";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "blocks",
      new TableColumn({
        name: "body",
        type: "text",
        isNullable: true,
        isUnique: false
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("blocks", "body");
  }
}
