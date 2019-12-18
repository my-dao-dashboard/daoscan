export class EmptyEnvError extends Error {}

export enum ENV {
  PARTICIPANTS_TABLE = "PARTICIPANTS_TABLE",
  BLOCKS_SQS_URL = "BLOCKS_SQS_URL",
  SCRAPING_SQS_URL = "SCRAPING_SQS_URL",
  APPLICATIONS_TABLE = "APPLICATIONS_TABLE",
  BLOCKS_TABLE = "BLOCKS_TABLE",
  ORGANISATIONS_TABLE = "ORGANISATIONS_TABLE",
  INFURA_PROJECT_ID = "INFURA_PROJECT_ID",
  PARTICIPANTS_INDEX = "PARTICIPANTS_INDEX"
}

export class FromEnv {
  static readString(name: ENV): string {
    const value = process.env[name];
    if (!value) {
      throw new EmptyEnvError(`Missing ${name} env`);
    }
    return value;
  }
}
