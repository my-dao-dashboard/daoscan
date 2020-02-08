import { InvalidCaseError } from "../shared/errors";

export enum PLATFORM {
  ARAGON = "ARAGON",
  MOLOCH_1 = "MOLOCH_1"
}

export namespace PLATFORM {
  export function fromString(platform: string): PLATFORM {
    switch (platform) {
      case PLATFORM.ARAGON:
        return PLATFORM.ARAGON;
      case PLATFORM.MOLOCH_1:
        return PLATFORM.MOLOCH_1;
      default:
        throw new InvalidCaseError(`Can not parse unknown platform ${platform}`);
    }
  }
}
