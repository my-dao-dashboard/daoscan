/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIdToDelegates1569249293900 implements MigrationInterface {
  readonly name = "AddIdToDelegates1569249293900";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "delegates",
      new TableColumn({
        name: "id",
        type: "BIGSERIAL",
        isPrimary: true,
        isNullable: false,
        isUnique: true
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("delegates", "id");
  }
}
