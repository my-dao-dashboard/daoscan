import { Inject, Service } from "typedi";
import { bind } from "decko";
import { MessariService } from "./messari.service";
import { Token } from "../domain/token";

@Service(TokenResolver.name)
export class TokenResolver {
  constructor(@Inject(MessariService.name) private readonly messari: MessariService) {}

  @bind()
  async value(root: Token, args: { symbol: string }) {
    return root.value(args.symbol);
  }
}
