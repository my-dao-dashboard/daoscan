import { ValueTransformer } from "typeorm";

export const addressTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue.toLowerCase(),
  from: (databaseValue: string): string => databaseValue.toLowerCase()
};
