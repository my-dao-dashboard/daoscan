import { BadRequestError } from "../shared/errors";

export interface BlockAddEvent {
  id: number;
}

export namespace BlockAddEvent {
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
