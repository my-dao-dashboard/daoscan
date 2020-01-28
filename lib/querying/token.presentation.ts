export class TokenPresentation {
  constructor(readonly name: string, readonly symbol: string, readonly amount: string, readonly decimals: number) {}

  toJSON() {
    return {
      name: this.name,
      symbol: this.symbol,
      amount: this.amount,
      decimals: this.decimals
    };
  }
}
