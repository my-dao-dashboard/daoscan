import { Inject, Service } from "typedi";
import { bind } from "decko";
import { ENV, EnvService } from "../services/env.service";
import { APIGatewayEvent } from "aws-lambda";
import { ForbiddenError } from "../shared/errors";
import { MigrationUpScenario } from "./migration-up.scenario";

@Service(MigrationController.name)
export class MigrationController {
  private readonly token: string;

  constructor(
    @Inject(MigrationUpScenario.name) private readonly upScenario: MigrationUpScenario,
    @Inject(EnvService.name) private readonly env: EnvService
  ) {
    this.token = env.readString(ENV.UTIL_SECRET);
  }

  ensureAuthorization(event: APIGatewayEvent) {
    const authorizationHeader = event.headers["Authorization"];
    const expectedHeader = `Bearer ${this.token}`;
    if (authorizationHeader !== expectedHeader) {
      throw new ForbiddenError(`Authorization token is invalid`);
    }
  }

  @bind()
  async up(event: APIGatewayEvent): Promise<{ migrations: string[] }> {
    this.ensureAuthorization(event);
    const migrationNames = await this.upScenario.execute();
    return {
      migrations: migrationNames
    };
  }
}
