/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCreationTimeToOrganisation1569249296600 implements MigrationInterface {
  readonly name = "AddCreationTimeToOrganisation1569249296600";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "organisations",
      new TableColumn({
        name: "createdAt",
        type: "TIMESTAMP",
        isNullable: false,
        isUnique: false,
        default: "'1970-01-01'"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("organisations", "createdAt");
  }
}
