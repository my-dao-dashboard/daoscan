/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MembershipAccountIsNotUnique1569249292500 implements MigrationInterface {
  readonly name = "MembershipAccountIsNotUnique1569249292500";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "memberships",
      "accountId",
      new TableColumn({
        name: "accountId",
        type: "varchar(42)",
        isUnique: false,
        isNullable: false
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "memberships",
      "accountId",
      new TableColumn({
        name: "accountId",
        type: "varchar(42)",
        isUnique: true,
        isNullable: false
      })
    );
  }
}
