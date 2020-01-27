/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RecreateApplications1569249292400 implements MigrationInterface {
  readonly name = "RecreateApplications1569249292400";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "applications",
      "id",
      new TableColumn({
        name: "address",
        type: "varchar(42)",
        isUnique: false,
        isNullable: false
      })
    );
    await queryRunner.changeColumn(
      "applications",
      "appId",
      new TableColumn({
        name: "appId",
        type: "varchar(400)",
        isUnique: false,
        isNullable: false
      })
    );
    await queryRunner.addColumn(
      "applications",
      new TableColumn({
        name: "id",
        type: "varchar(400)",
        isNullable: false,
        isUnique: false
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "applications",
      "address",
      new TableColumn({
        name: "id",
        type: "varchar(400)",
        isUnique: true,
        isNullable: false
      })
    );
  }
}
