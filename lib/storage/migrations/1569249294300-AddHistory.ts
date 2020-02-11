/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddHistory1569249294300 implements MigrationInterface {
  readonly name = "AddHistory1569249294300";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "history",
        columns: [
          new TableColumn({
            name: "id",
            type: "BIGSERIAL",
            isPrimary: true,
            isNullable: false,
            isUnique: true
          }),
          new TableColumn({
            name: "eventId",
            type: "BIGINT",
            isUnique: false,
            isNullable: false
          }),
          new TableColumn({
            name: "resourceId",
            type: "BIGINT",
            isUnique: false,
            isNullable: false
          }),
          new TableColumn({
            name: "resourceKind",
            type: "varchar(400)",
            isUnique: false,
            isNullable: false
          })
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("history");
  }
}
