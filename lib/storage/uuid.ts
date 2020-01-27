import uuid from "uuid";

export class UUID {
  private readonly s: string;

  constructor(s?: string | UUID) {
    this.s = s ? s.toString() : uuid.v4();
  }

  toString() {
    return this.s;
  }
}
