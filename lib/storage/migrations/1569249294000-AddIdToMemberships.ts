/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIdToMemberships1569249294000 implements MigrationInterface {
  readonly name = "AddIdToMemberships1569249294000";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "memberships",
      "id",
      new TableColumn({
        name: "id",
        type: "BIGSERIAL",
        isPrimary: true,
        isNullable: false,
        isUnique: true
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "memberships",
      "id",
      new TableColumn({
        name: "id",
        type: "varchar(400)",
        isNullable: false,
        isUnique: true,
        isPrimary: false
      })
    );
  }
}
