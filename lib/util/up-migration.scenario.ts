import { Scenario } from "../shared/scenario.interface";
import { Inject, Service } from "typedi";
import { ConnectionFactory } from "../rel-storage/connection-factory";

@Service(UpMigrationScenario.name)
export class UpMigrationScenario implements Scenario<void, string[]> {
  constructor(@Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory) {}

  async execute(): Promise<string[]> {
    const connection = await this.connectionFactory.writing();
    await connection.runMigrations();
    return connection.migrations.map(m => m.name || '')
  }
}
