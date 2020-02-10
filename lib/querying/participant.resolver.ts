import { Service } from "typedi";
import { Participant } from "../domain/participant";
import { bind } from "decko";

@Service(ParticipantResolver.name)
export class ParticipantResolver {
  constructor() {}

  @bind()
  async shares(root: Participant) {
    const shares = await root.organisation.shares();
    return shares?.balanceOf(root.address);
  }
}
