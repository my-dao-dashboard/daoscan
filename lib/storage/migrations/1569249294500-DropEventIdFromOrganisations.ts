/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class DropEventIdFromOrganisations1569249294500 implements MigrationInterface {
  readonly name = "DropEventIdFromOrganisations1569249294500";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("organisations", "eventId");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "organisations",
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
