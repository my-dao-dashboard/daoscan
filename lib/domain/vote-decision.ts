export enum VOTE_DECISION {
  ABSTAIN = "ABSTAIN",
  YES = "YES",
  NO = "NO"
}

export namespace VOTE_DECISION {
  export function fromNumber(vote: number) {
    switch (vote) {
      case 0:
        return VOTE_DECISION.ABSTAIN;
      case 1:
        return VOTE_DECISION.YES;
      case 2:
        return VOTE_DECISION.NO;
      default:
        throw new Error(`Unknown vote ${vote} for Moloch contract`);
    }
  }
}
