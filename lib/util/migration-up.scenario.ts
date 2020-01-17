import { Inject, Service } from "typedi";
import { ConnectionFactory } from "../storage/connection.factory";
import { Scenario } from "../shared/scenario";

@Service(MigrationUpScenario.name)
export class MigrationUpScenario implements Scenario<void, string[]> {
  constructor(@Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory) {}

  async execute(): Promise<string[]> {
    const connection = await this.connectionFactory.writing();
    await connection.runMigrations();
    return connection.migrations.map(m => m.name || "");
  }
}
