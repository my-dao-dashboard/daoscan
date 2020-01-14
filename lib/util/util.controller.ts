import { Inject, Service } from "typedi";
import { UpMigrationScenario } from "./up-migration.scenario";
import { bind } from "decko";
import { EnvService } from "../services/env.service";
import { APIGatewayEvent } from "aws-lambda";
import { ENV } from "../shared/env";
import { BadRequestError, ForbiddenError } from "../shared/errors";

export class NoBodyError extends BadRequestError {}
export class NoTokenError extends BadRequestError {}

@Service(UtilController.name)
export class UtilController {
  private readonly expectedSecret: string;

  constructor(
    @Inject(UpMigrationScenario.name) private readonly upMigrationScenario: UpMigrationScenario,
    @Inject(EnvService.name) private readonly env: EnvService
  ) {
    this.expectedSecret = env.readString(ENV.UTIL_SECRET);
  }

  readSecret(event: APIGatewayEvent) {
    if (event.body) {
      const body = JSON.parse(event.body);
      const secret = body.token;
      if (secret) {
        return secret;
      } else {
        throw new NoTokenError(`No token found`);
      }
    } else {
      throw new NoBodyError(`No body present`);
    }
  }

  ensureCorrectSecret(event: APIGatewayEvent) {
    const secret = this.readSecret(event);
    if (secret != this.expectedSecret) {
      throw new ForbiddenError(`Token ${secret} is invalid`);
    }
  }

  @bind()
  async migrateUp(event: APIGatewayEvent): Promise<{ migrations: string[] }> {
    this.ensureCorrectSecret(event);
    const migrationNames = await this.upMigrationScenario.execute();
    return {
      migrations: migrationNames
    };
  }
}
