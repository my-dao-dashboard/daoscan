/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

const COLUMNS = [
  new TableColumn({
    name: "eventId",
    type: "varchar(400)",
    isNullable: false,
    isUnique: false
  })
];

export class LinkOrganisationAndEvent1569249292100 implements MigrationInterface {
  readonly name = "LinkOrganisationAndEvent1569249292100";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumns("organisations", COLUMNS);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumns("organisations", COLUMNS);
  }
}
