/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCreationTimeToVote1569249297000 implements MigrationInterface {
  readonly name = "AddCreationTimeToVote1569249297000";
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "votes",
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
    await queryRunner.dropColumn("votes", "createdAt");
  }
}
