/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class DropHistoryTable1569249296000 implements MigrationInterface {
  readonly name = "DropHistoryTable1569249296000";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("history");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
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
}
