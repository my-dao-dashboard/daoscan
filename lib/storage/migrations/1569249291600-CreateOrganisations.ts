/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrganisations1569249291600 implements MigrationInterface {
  readonly name = "CreateOrganisations1569249291600";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "organisations",
        columns: [
          {
            name: "id",
            type: "varchar(42)",
            isNullable: false,
            isUnique: true
          },
          {
            name: "name",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "platform",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          }
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("organisations");
  }
}
