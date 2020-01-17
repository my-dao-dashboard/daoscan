import { Inject, Service } from "typedi";
import { bind } from "decko";
import { BlockTickScenario } from "./block-tick.scenario";

@Service(BlockController.name)
export class BlockController {
  constructor(@Inject(BlockTickScenario.name) private readonly tickScenario: BlockTickScenario) {}

  @bind()
  add() {}

  @bind()
  async tick() {
    const worthAdding = await this.tickScenario.execute();
    console.debug("Worth adding: ", worthAdding);
  }
}
