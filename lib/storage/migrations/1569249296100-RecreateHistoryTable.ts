/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

const COLUMN = new TableColumn({
  name: "eventId",
  type: "BIGINT",
  isNullable: false,
  isUnique: false,
  default: 0
});

export class RecreateHistoryTable1569249296100 implements MigrationInterface {
  readonly name = "RecreateHistoryTable1569249296100";

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
    await queryRunner.dropColumn("applications", "eventId");
    await queryRunner.dropColumn("delegates", "eventId");
    await queryRunner.dropColumn("memberships", "eventId");
    await queryRunner.dropColumn("organisations", "eventId");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("history");
    await queryRunner.addColumn("applications", COLUMN);
    await queryRunner.addColumn("delegates", COLUMN);
    await queryRunner.addColumn("memberships", COLUMN);
    await queryRunner.addColumn("organisations", COLUMN);
  }
}
