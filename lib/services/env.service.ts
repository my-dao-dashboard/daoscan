import { Service } from "typedi";
import { ConfigurationError } from "../shared/errors";

export enum ENV {
  BLOCKS_SQS_URL = "BLOCKS_SQS_URL",
  SCRAPING_SQS_URL = "SCRAPING_SQS_URL",
  ETHEREUM_RPC = "ETHEREUM_RPC",
  READ_DATABASE_URL = "READ_DATABASE_URL",
  WRITE_DATABASE_URL = "WRITE_DATABASE_URL",
  UTIL_SECRET = "UTIL_SECRET",
  STAGE = "STAGE"
}

@Service(EnvService.name)
export class EnvService {
  readString(name: ENV): string {
    const value = process.env[name];
    if (!value) {
      throw new ConfigurationError(`Missing ${name} env`);
    }
    return value;
  }

  get canQueue(): boolean {
    const stage = this.readString(ENV.STAGE);
    return stage.toLowerCase() !== "dev";
  }
}
