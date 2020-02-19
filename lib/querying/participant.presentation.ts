import { Token } from "../domain/token";

export class ParticipantPresentation {
  constructor(readonly address: string, readonly shares: Token) {}
}
