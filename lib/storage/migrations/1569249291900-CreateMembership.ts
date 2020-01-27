/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMembership1569249291900 implements MigrationInterface {
  readonly name = "CreateMembership1569249291900";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "memberhsips",
        columns: [
          {
            name: "id",
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
            name: "accountId",
            type: "varchar(400)",
            isNullable: false,
            isUnique: true
          },
          {
            name: "balanceDelta",
            type: "NUMERIC(80)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "eventId",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "kind",
            type: "varchar(256)",
            isNullable: false,
            isUnique: false
          }
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("memberships");
  }
}
