import { Inject, Service } from "typedi";
import { IToken } from "../domain/token.interface";
import { bind } from "decko";
import { MessariService } from "./messari.service";
import BigNumber from "bignumber.js";

@Service(TokenResolver.name)
export class TokenResolver {
  constructor(@Inject(MessariService.name) private readonly messari: MessariService) {}

  @bind()
  async value(root: IToken, args: { symbol: string }) {
    const usdPerUnit = await this.messari.usdPrice(root.symbol);
    const usdPerTarget = await this.messari.usdPrice(args.symbol);
    if (usdPerUnit && usdPerTarget) {
      const tokenAmount = new BigNumber(root.amount).div(10 ** root.decimals);
      const targetValue = tokenAmount.multipliedBy(usdPerUnit).div(usdPerTarget);
      const amount = (targetValue.toNumber() * 10 ** 4).toFixed(0);
      return {
        name: args.symbol,
        symbol: args.symbol,
        amount: amount,
        decimals: 4
      };
    } else {
      return undefined;
    }
  }
}
