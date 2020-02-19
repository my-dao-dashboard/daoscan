interface Props {
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
}

export class Token {
  readonly name = this.props.name;
  readonly symbol = this.props.symbol;
  readonly amount = this.props.amount;
  readonly decimals = this.props.decimals;

  constructor(readonly props: Props) {}
}
