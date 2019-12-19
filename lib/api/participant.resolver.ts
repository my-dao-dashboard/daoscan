import { Service } from "typedi";
import { bind } from "decko";

@Service()
export class ParticipantResolver {
  constructor() {}

  @bind()
  shares(...args: any[]) {
    console.log("ParticipantResolver.shares", args);
    return null;
  }
}
