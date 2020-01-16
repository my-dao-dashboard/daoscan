/* istanbul ignore file */
import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateOrganisationCreatedEvents1569249291600 implements MigrationInterface {
  readonly name = "CreateOrganisationCreatedEvents1569249291600";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "organisation_created_events",
        columns: [
          {
            name: "id",
            type: "serial",
            isNullable: false,
            isUnique: true
          },
          {
            name: "blockId",
            type: "integer",
            isNullable: false,
            isUnique: false
          },
          {
            name: "platform",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "name",
            type: "varchar(400)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "address",
            type: "varchar(42)",
            isNullable: false,
            isUnique: false
          },
          {
            name: "txid",
            type: "varchar(66)",
            isNullable: false,
            isUnique: false
          }
        ]
      })
    );
    await queryRunner.createIndex(
      "organisation_created_events",
      new TableIndex({
        name: "organisation_created_events-blockId",
        columnNames: ["blockId"]
      })
    );
    await queryRunner.createIndex(
      "organisation_created_events",
      new TableIndex({
        name: "organisation_created_events-blockId-platform",
        columnNames: ["blockId", "platform"]
      })
    );
    await queryRunner.createIndex(
      "organisation_created_events",
      new TableIndex({
        name: "organisation_created_events-platform",
        columnNames: ["platform"]
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("organisation_created_events", "organisation_created_events-blockId");
    await queryRunner.dropIndex("organisation_created_events", "organisation_created_events-blockId-platform");
    await queryRunner.dropIndex("organisation_created_events", "organisation_created_events-platform");
    await queryRunner.dropTable("organisation_created_events");
  }
}
