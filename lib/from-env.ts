export class EmptyEnvError extends Error {}

export class FromEnv {
  static string(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new EmptyEnvError(`Missing ${name} env`);
    }
    return value;
  }
}
