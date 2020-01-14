import { Inject, Service } from "typedi";
import { EnvService } from "../services/env.service";
import { ENV } from "../shared/env";
import { Connection, createConnection } from "typeorm";
import { memoize } from "decko";
import * as path from "path";
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions";
import * as migrations from './migrations'

export type CreateConnectionFunction = (options: ConnectionOptions) => Promise<Connection>;

@Service(ConnectionFactory.name)
export class ConnectionFactory {
  private readonly readingConnectionUrl: string;
  private readonly writingConnectionUrl: string;

  constructor(@Inject(EnvService.name) env: EnvService) {
    this.readingConnectionUrl = env.readString(ENV.READ_DATABASE_URL);
    this.writingConnectionUrl = env.readString(ENV.WRITE_DATABASE_URL);
  }

  @memoize()
  reading(createConnectionFunc: CreateConnectionFunction = createConnection): Promise<Connection> {
    return createConnectionFunc({
      name: "reading",
      type: "postgres",
      url: this.readingConnectionUrl,
      migrationsRun: false,
      entities: [`${path.join(__dirname, "./*.entity.{ts,js}")}`],
      logging: true
    });
  }

  @memoize()
  writing(createConnectionFunc: CreateConnectionFunction = createConnection): Promise<Connection> {
    return createConnectionFunc({
      name: "writing",
      type: "postgres",
      url: this.writingConnectionUrl,
      migrationsRun: true,
      migrations: Object.values(migrations),
      entities: [`${path.join(__dirname, "./*.entity.{ts,js}")}`],
      logging: true
    });
  }
}
