/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateOrganisations1569249291700 implements MigrationInterface {
  readonly name = "CreateOrganisations1569249291700";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "organisations",
        columns: [
          {
            name: "id",
            type: "serial",
            isNullable: false,
            isUnique: true
          },
          {
            name: "platform",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "name",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "address",
            type: "varchar(42)",
            isNullable: false,
            isUnique: true
          }
        ]
      })
    );
    await queryRunner.createIndex(
      "organisations",
      new TableIndex({
        name: "organisations-platform",
        columnNames: ["platform"]
      })
    );
    await queryRunner.createIndex(
      "organisations",
      new TableIndex({
        name: "organisations-address",
        columnNames: ["address"],
        isUnique: true
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("organisations", "organisations-address");
    await queryRunner.dropIndex("organisations", "organisations-platform");
    await queryRunner.dropTable("organisations");
  }
}
