import { Inject, Service } from "typedi";
import { ConnectionFactory } from "./connection-factory";
import { ObjectType } from "typeorm/common/ObjectType";
import { EntitySchema, Repository } from "typeorm";

@Service(RepositoryFactory.name)
export class RepositoryFactory {
  constructor(@Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory) {}

  async reading<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Promise<Repository<Entity>> {
    const connection = await this.connectionFactory.reading();
    return connection.getRepository(target);
  }

  async writing<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Promise<Repository<Entity>> {
    const connection = await this.connectionFactory.writing();
    return connection.getRepository(target);
  }
}
