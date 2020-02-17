interface ProposalProps {
  index: number;
  proposer: string;
  createdAt: Date;
  payload: any;
}

export class Proposal {
  readonly index = this.props.index;
  readonly proposer = this.props.proposer;
  readonly createdAt = this.props.createdAt.toISOString();
  readonly createdAtDate = this.props.createdAt;
  readonly payload = this.props.payload;

  constructor(readonly props: ProposalProps) {}
}
