import { Organisation } from "./organisation";

export class Participant {
  constructor(readonly address: string, readonly organisation: Organisation) {}

  async shares() {
    const shares = await this.organisation.shares();
    if (shares) {
      return shares.balanceOf(this.address);
    }
  }
}
