import { Inject, Service } from "typedi";
import { MessariService } from "../querying/messari.service";
import { Token, TokenProps } from "./token";

@Service(TokenFactory.name)
export class TokenFactory {
  constructor(@Inject(MessariService.name) private readonly messari: MessariService) {}

  build(props: TokenProps) {
    return new Token(props, this.messari);
  }
}
