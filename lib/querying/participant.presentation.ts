import { TokenPresentation } from "./token.presentation";

export class ParticipantPresentation {
  constructor(readonly address: string, readonly shares: TokenPresentation) {}
}
