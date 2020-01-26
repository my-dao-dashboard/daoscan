/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateApplications1569249291800 implements MigrationInterface {
  readonly name = "CreateApplications1569249291800";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "applications",
        columns: [
          {
            name: "id", // same as proxyAddress
            type: "varchar(400)",
            isNullable: false,
            isUnique: true
          },
          {
            name: "organisationId",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "appId",
            type: "varchar(400)",
            isNullable: false,
            isUnique: true
          }
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("organisations");
  }
}
