import { Service } from "typedi";
import { ENV } from "../shared/env";
import { ConfigurationError } from "../shared/errors";

export interface IEnvService {
  readString(name: ENV): string;
}

@Service(EnvService.name)
export class EnvService implements IEnvService {
  readString(name: ENV): string {
    const value = process.env[name];
    if (!value) {
      throw new ConfigurationError(`Missing ${name} env`);
    }
    return value;
  }
}
