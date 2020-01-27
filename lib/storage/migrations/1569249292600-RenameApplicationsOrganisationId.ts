/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RenameApplicationsOrganisationId1569249292600 implements MigrationInterface {
  readonly name = "RenameApplicationsOrganisationId1569249292600";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("applications", "organisationId", "organisationAddress");
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn("applications", "organisationAddress", "organisationId");
  }
}
