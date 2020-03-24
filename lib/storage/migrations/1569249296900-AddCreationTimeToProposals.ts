/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCreationTimeToProposals1569249296900 implements MigrationInterface {
  readonly name = "AddCreationTimeToProposals1569249296900";
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "proposals",
      new TableColumn({
        name: "createdAt",
        type: "TIMESTAMP",
        isNullable: false,
        isUnique: false,
        default: "'1970-01-01'"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("proposals", "createdAt");
  }
}
