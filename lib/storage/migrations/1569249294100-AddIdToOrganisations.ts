/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIdToOrganisations1569249294100 implements MigrationInterface {
  readonly name = "AddIdToOrganisations1569249294100";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "organisations",
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
    await queryRunner.dropColumn("organisations", "id");
  }
}
