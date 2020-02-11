/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIdToApplications1569249294200 implements MigrationInterface {
  readonly name = "AddIdToApplications1569249294200";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "applications",
      new TableColumn({
        name: "id",
        type: "BIGSERIAL",
        isPrimary: true,
        isNullable: false,
        isUnique: true
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("applications", "id");
  }
}
