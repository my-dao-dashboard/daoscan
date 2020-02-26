/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddCreationIndexToOrganisation1569249296700 implements MigrationInterface {
  readonly name = "AddCreationIndexToOrganisation1569249296700";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createIndex(
      "organisations",
      new TableIndex({
        name: "idx_organisations_createdAt-id",
        columnNames: ["createdAt", "id"]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("organisations", "idx_organisations_createdAt-id");
  }
}
