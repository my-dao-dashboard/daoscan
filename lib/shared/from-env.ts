import { ENV } from "./env";

export class EmptyEnvError extends Error {}

export class FromEnv {
  static readString(name: ENV): string {
    const value = process.env[name];
    if (!value) {
      throw new EmptyEnvError(`Missing ${name} env`);
    }
    return value;
  }
}
