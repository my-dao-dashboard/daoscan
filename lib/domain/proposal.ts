export enum PROPOSAL_STATUS {
  ACTIVE = "ACTIVE",
  PASS = "PASS",
  REJECT = "REJECT",
  ABORT = "ABORT"
}

interface ProposalProps {
  organisationAddress: string;
  index: number;
  proposer: string;
  createdAt: Date;
  payload: any;
  status: PROPOSAL_STATUS;
}

export class Proposal {
  readonly index = this.props.index;
  readonly proposer = this.props.proposer;
  readonly createdAt = this.props.createdAt.toISOString();
  readonly createdAtDate = this.props.createdAt;
  readonly payload = this.props.payload;
  readonly organisationAddress = this.props.organisationAddress;
  readonly status = this.props.status;

  constructor(private readonly props: ProposalProps) {}
}
