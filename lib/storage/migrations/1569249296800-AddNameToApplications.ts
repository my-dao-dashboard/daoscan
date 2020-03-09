/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNameToApplications1569249296800 implements MigrationInterface {
  readonly name = "AddNameToApplications1569249296800";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "applications",
      new TableColumn({
        name: "name",
        type: "VARCHAR(255)",
        isNullable: false,
        isUnique: false,
        default: "'Unknown'"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("applications", "name");
  }
}
