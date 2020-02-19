import { MessariService } from "../querying/messari.service";
import { Contract } from "web3-eth-contract";
import { PLATFORM } from "./platform";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { Token } from "./token";
import BigNumber from "bignumber.js";

interface Props {
  name: string;
  symbol: string;
  decimals: number;
  amount: string;
  token: Contract;
  platform: PLATFORM;
  bank: Token[];
}

export class Shares extends Token {
  private readonly platform: PLATFORM;
  private readonly token: Contract;
  private readonly bank: Token[];

  constructor(props: Props, messari: MessariService) {
    super(props, messari);
    this.platform = props.platform;
    this.token = props.token;
    this.bank = props.bank;
  }

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
      if (usdPrice) {
        const realAmount = new BigNumber(token.amount).div(10 ** token.decimals).toNumber();
        return usdPrice * realAmount;
      } else {
        return 0;
      }
    });
    const perToken = await Promise.all<number>(perTokenPromised);
    const totalUsd = perToken.reduce((acc, n) => acc + n, 0);
    const sharesNumber = new BigNumber(this.amount).div(10 ** this.decimals);
    return new BigNumber(totalUsd).div(sharesNumber).toNumber();
  }

  async value(symbol: string): Promise<Token | undefined> {
    const assetPrice = await this.messari.usdPrice(symbol);
    const usdValue = await this.usdValue();
    if (assetPrice) {
      const assetAmount = usdValue / assetPrice;
      const amount = (assetAmount * 10 ** 4).toFixed(0);
      return new Token(
        {
          name: symbol,
          symbol: symbol,
          amount: amount,
          decimals: 4
        },
        this.messari
      );
    } else {
      return undefined;
    }
  }
}
