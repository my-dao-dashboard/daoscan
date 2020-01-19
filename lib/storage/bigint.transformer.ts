import { ValueTransformer } from "typeorm";

export const bigintTransformer: ValueTransformer = {
  to: (entityValue: bigint) => entityValue.toString(),
  from: (databaseValue: string): bigint => BigInt(databaseValue)
};
