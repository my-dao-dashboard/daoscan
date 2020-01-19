import { BadRequestError } from "../shared/errors";

export enum COMMAND_KIND {
  COMMIT = "COMMIT",
  REVERT = "REVERT"
}

export namespace COMMAND_KIND {
  export function fromString(s: string): COMMAND_KIND {
    switch (s) {
      case COMMAND_KIND.COMMIT:
        return COMMAND_KIND.COMMIT;
      case COMMAND_KIND.REVERT:
        return COMMAND_KIND.REVERT;
      default:
        throw new BadRequestError(`Unexpected command kind ${s}`);
    }
  }
}
