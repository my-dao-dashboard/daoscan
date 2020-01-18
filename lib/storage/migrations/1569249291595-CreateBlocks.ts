/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBlocks1569249291595 implements MigrationInterface {
  readonly name = "CreateBlocks1569249291595";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "blocks",
        columns: [
          {
            name: "id",
            type: "bigint",
            isNullable: false,
            isUnique: true
          },
          {
            name: "hash",
            type: "varchar(66)",
            isNullable: false,
            isUnique: true
          }
        ]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("blocks");
  }
}
