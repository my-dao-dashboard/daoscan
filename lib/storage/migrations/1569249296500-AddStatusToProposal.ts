/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStatusToProposal1569249296500 implements MigrationInterface {
  readonly name = "AddStatusToProposal1569249296500";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "proposals",
      new TableColumn({
        name: "status",
        type: "VARCHAR(255)",
        isNullable: false,
        isUnique: false
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("proposals", "status");
  }
}
