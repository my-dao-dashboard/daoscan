/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEvents1569249291700 implements MigrationInterface {
  readonly name = "CreateEvents1569249291700";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "events",
        columns: [
          {
            name: "id",
            type: "varchar(68)",
            isNullable: false,
            isUnique: true
          },
          {
            name: "blockId",
            type: "bigint",
            isNullable: false,
            isUnique: false
          },
          {
            name: "blockHash",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "platform",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "payload",
            type: "text",
            isNullable: false,
            isUnique: false
          }
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("organisations");
  }
}
