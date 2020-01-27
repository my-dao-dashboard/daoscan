/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RenameMembershipAddresses1569249292700 implements MigrationInterface {
  readonly name = "RenameMembershipAddresses1569249292700";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("memberships", "organisationId", "organisationAddress");
    await queryRunner.renameColumn("memberships", "accountId", "accountAddress");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("memberships", "organisationAddress", "organisationId");
    await queryRunner.renameColumn("memberships", "accountAddress", "accountId");
  }
}
