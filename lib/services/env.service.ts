import { Service } from "typedi";
import { ENV } from "../shared/env";
import { ConfigurationError } from "../shared/errors";

@Service()
export class EnvService {
  readString(name: ENV): string {
    const value = process.env[name];
    if (!value) {
      throw new ConfigurationError(`Missing ${name} env`);
    }
    return value;
  }
}
