import uuid from "uuid";

export class UUID {
  private readonly s: string;

  constructor(s?: string) {
    this.s = s || uuid.v4();
  }

  toString() {
    return this.s;
  }
}
