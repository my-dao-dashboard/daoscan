import { VOTE_DECISION } from "./vote-decision";
import { Participant } from "./participant";

interface VoteProps {
  voter?: Participant;
  decision: VOTE_DECISION;
  organisationAddress: string;
  createdAt: Date;
}

export class Vote {
  readonly voter = this.props.voter;
  readonly decision = this.props.decision;
  readonly organisationAddress = this.props.organisationAddress;
  readonly createdAt = this.props.createdAt.toISOString();

  constructor(private readonly props: VoteProps) {}
}
