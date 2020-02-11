/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddOrganisationAddressToEvent1569249293200 implements MigrationInterface {
  readonly name = "AddOrganisationAddressToEvent1569249293200";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "events",
      new TableColumn({
        name: "organisationAddress",
        type: "VARCHAR(42)",
        isNullable: false,
        isUnique: false,
        default: "'0x0000000000000000000000000000000000000000'"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("events", "organisationAddress");
  }
}
