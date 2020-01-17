import { Inject, Service } from "typedi";
import { bind } from "decko";
import { ENV, EnvService } from "../services/env.service";
import { APIGatewayEvent } from "aws-lambda";
import { BadRequestError, ForbiddenError } from "../shared/errors";
import { MigrationUpScenario } from "./migration-up.scenario";

export class NoBodyError extends BadRequestError {}
export class NoTokenError extends BadRequestError {}

@Service(MigrationController.name)
export class MigrationController {
  private readonly expectedSecret: string;

  constructor(
    @Inject(MigrationUpScenario.name) private readonly upScenario: MigrationUpScenario,
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
  async up(event: APIGatewayEvent): Promise<{ migrations: string[] }> {
    this.ensureCorrectSecret(event);
    const migrationNames = await this.upScenario.execute();
    return {
      migrations: migrationNames
    };
  }
}
