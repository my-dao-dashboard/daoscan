import { Service } from "typedi";
import { bind } from "decko";

@Service(ParticipantResolver.name)
export class ParticipantResolver {
  constructor() {}

  @bind()
  shares(...args: any[]) {
    console.log("ParticipantResolver.shares", args);
    return null;
  }
}
