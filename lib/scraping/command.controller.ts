import { Service } from "typedi";
import { bind } from "decko";

@Service()
export class CommandController {
  @bind()
  handle() {}
}
