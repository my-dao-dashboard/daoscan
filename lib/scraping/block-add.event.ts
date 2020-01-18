import { BadRequestError } from "../shared/errors";
import { Block } from "./block";

export interface BlockAddEvent {
  id: number;
}

export namespace BlockAddEvent {
  export function fromBlock(block: Block): BlockAddEvent {
    return { id: block.id };
  }

  export function fromString(payload: string | null): BlockAddEvent {
    if (payload) {
      const parsed = JSON.parse(payload);
      if (parsed.id) {
        return parsed;
      }
    }
    throw new BadRequestError(`Expect BlockAddEvent in payload`);
  }
}
