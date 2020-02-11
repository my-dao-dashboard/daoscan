import { Organisation } from "./organisation";

export class Participant {
  constructor(readonly address: string, readonly organisation: Organisation) {}
}
