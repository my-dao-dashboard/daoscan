/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class DropEventIdFromApplications1569249294400 implements MigrationInterface {
  readonly name = "DropEventIdFromApplications1569249294400";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("applications", "eventId");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "applications",
      new TableColumn({
        name: "eventId",
        type: "varchar(400)",
        isNullable: false,
        isUnique: true,
        default: "00000000-0000-0000-0000-000000000000"
      })
    );
  }
}
