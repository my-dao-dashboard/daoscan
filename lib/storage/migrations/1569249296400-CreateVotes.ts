/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateVotes1569249296400 implements MigrationInterface {
  readonly name = "CreateVotes1569249296400";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "votes",
        columns: [
          new TableColumn({
            name: "id",
            type: "BIGSERIAL",
            isPrimary: true,
            isNullable: false,
            isUnique: true
          }),
          new TableColumn({
            name: "proposalIndex",
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
            name: "voter",
            type: "VARCHAR(42)",
            isNullable: false,
            isUnique: false
          }),
          new TableColumn({
            name: "decision",
            type: "VARCHAR(42)",
            isNullable: false,
            isUnique: false
          })
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("votes");
  }
}
