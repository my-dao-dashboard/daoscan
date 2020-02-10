import { IToken } from "./token.interface";
import BigNumber from "bignumber.js";
import { MessariService } from "../querying/messari.service";
import { Contract } from "web3-eth-contract";
import { PLATFORM } from "./platform";
import { UnreachableCaseError } from "../shared/unreachable-case-error";

export class Shares implements IToken {
  constructor(
    readonly decimals: number,
    readonly amount: string,
    readonly symbol: string,
    readonly name: string,
    readonly token: Contract,
    readonly platform: PLATFORM,
    private readonly bank: IToken[],
    private readonly messari: MessariService
  ) {}

  async balanceOf(participantAddress: string) {
    switch (this.platform) {
      case PLATFORM.MOLOCH_1:
        const member = await this.token.methods.members(participantAddress).call();
        return {
          ...this,
          amount: member.shares
        };
      case PLATFORM.ARAGON:
        const balance = await this.token.methods.balanceOf(participantAddress).call();
        return {
          ...this,
          amount: balance
        };
      default:
        throw new UnreachableCaseError(this.platform);
    }
  }

  async usdValue(): Promise<number> {
    const perTokenPromised = this.bank.map(async token => {
      const usdPrice = await this.messari.usdPrice(token.symbol);
      const realAmount = new BigNumber(token.amount).div(10 ** token.decimals).toNumber();
      return usdPrice * realAmount;
    });
    const perToken = await Promise.all<number>(perTokenPromised);
    const totalUsd = perToken.reduce((acc, n) => acc + n, 0);
    const sharesNumber = new BigNumber(this.amount).div(10 ** this.decimals);
    return new BigNumber(totalUsd).div(sharesNumber).toNumber();
  }

  async value(symbol: string): Promise<IToken> {
    const assetPrice = await this.messari.usdPrice(symbol);
    const usdValue = await this.usdValue();
    const assetAmount = usdValue / assetPrice;
    const amount = (assetAmount * 10 ** 4).toFixed(0);
    return {
      name: symbol,
      symbol: symbol,
      amount: amount,
      decimals: 4
    };
  }
}
