export enum PLATFORM {
  ARAGON = "ARAGON"
}

export namespace PLATFORM {
  export function fromString(platform: string): PLATFORM {
    switch (platform) {
      case PLATFORM.ARAGON:
        return PLATFORM.ARAGON;
      default:
        throw new Error(`Can not parse unknown platform ${platform}`);
    }
  }
}
