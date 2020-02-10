/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddProposals1569249293000 implements MigrationInterface {
  readonly name = "AddProposals1569249293000";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "proposals",
        columns: [
          new TableColumn({
            name: "eventId",
            type: "varchar(400)",
            isNullable: false,
            isUnique: true
          }),
          new TableColumn({
            name: "id",
            type: "integer",
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
    await queryRunner.dropTable("proposals");
  }
}
