/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddDelegate1569249292900 implements MigrationInterface {
  readonly name = "AddDelegate1569249292900";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "delegates",
        columns: [
          new TableColumn({
            name: "eventId",
            type: "varchar(400)",
            isNullable: false,
            isUnique: true
          }),
          new TableColumn({
            name: "address",
            type: "VARCHAR(42)",
            isNullable: false,
            isUnique: false
          }),
          new TableColumn({
            name: "delegateFor",
            type: "VARCHAR(42)",
            isNullable: false,
            isUnique: false
          }),
          new TableColumn({
            name: "organisationAddress",
            type: "VARCHAR(42)",
            isNullable: false,
            isUnique: false
          })
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("delegates");
  }
}
