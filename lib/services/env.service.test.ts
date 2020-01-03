import { EnvService } from "./env.service";
import { ENV } from "../shared/env";
import { ConfigurationError } from "../shared/errors";

test("read", () => {
  const service = new EnvService();
  const value = "foo";
  process.env[ENV.ORGANISATIONS_TABLE] = value;
  expect(service.readString(ENV.ORGANISATIONS_TABLE)).toEqual(value);
});

test("throw if empty", async () => {
  const service = new EnvService();
  process.env[ENV.ORGANISATIONS_TABLE] = "";
  expect(() => service.readString(ENV.ORGANISATIONS_TABLE)).toThrow(
    new ConfigurationError(`Missing ${ENV.ORGANISATIONS_TABLE} env`)
  );
});
