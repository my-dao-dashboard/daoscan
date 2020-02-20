/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateProposals1569249296300 implements MigrationInterface {
  readonly name = "CreateProposals1569249296300";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "proposals",
        columns: [
          new TableColumn({
            name: "id",
            type: "BIGSERIAL",
            isPrimary: true,
            isNullable: false,
            isUnique: true
          }),
          new TableColumn({
            name: "index",
            type: "INTEGER",
            isNullable: false,
            isUnique: false
          }),
          new TableColumn({
            name: "organisationAddress",
            type: "VARCHAR(42)",
            isNullable: false,
            isUnique: false
          }),
          new TableColumn({
            name: "proposer",
            type: "VARCHAR(42)",
            isNullable: false,
            isUnique: false
          }),
          new TableColumn({
            name: "payload",
            type: "JSONB",
            isNullable: true,
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
