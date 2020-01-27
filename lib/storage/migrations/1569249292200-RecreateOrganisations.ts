/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class RecreateOrganisations1569249292200 implements MigrationInterface {
  readonly name = "RecreateOrganisations1569249292200";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "organisations",
      "id",
      new TableColumn({
        name: "address",
        type: "varchar(42)",
        isUnique: false,
        isNullable: false
      })
    );
    await queryRunner.changeColumn('organisations', 'eventId', new TableColumn({
      name: 'id',
      type: 'varchar(400)',
      isNullable: false,
      isUnique: true
    }))
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "organisations",
      "address",
      new TableColumn({
        name: "id",
        type: "varchar(42)",
        isUnique: true,
        isNullable: false
      })
    );
    await queryRunner.changeColumn('organisations', 'id', new TableColumn({
      name: 'eventId',
      type: 'varchar(400)',
      isNullable: false,
      isUnique: false
    }))
  }
}
