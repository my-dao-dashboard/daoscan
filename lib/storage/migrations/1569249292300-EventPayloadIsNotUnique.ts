/* istanbul ignore file */
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class EventPayloadIsNotUnique1569249292300 implements MigrationInterface {
  readonly name = "EventPayloadIsNotUnique1569249292300";

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "events",
      "payload",
      new TableColumn({
        name: "payload",
        type: "text",
        isUnique: false,
        isNullable: false
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      "events",
      "payload",
      new TableColumn({
        name: "payload",
        type: "text",
        isUnique: true,
        isNullable: false
      })
    );
  }
}
