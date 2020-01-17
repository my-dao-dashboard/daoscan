import { Service } from "typedi";
import { Scenario } from "../shared/scenario";
import { BlockAddEvent } from "./block-add.event";

@Service(BlockAddScenario.name)
export class BlockAddScenario implements Scenario<BlockAddEvent, void> {
  async execute(blockAddEvent: BlockAddEvent): Promise<void> {
    // determine if reorg
    // if reorg => block revert scenario
    // block save scenario
  }
}
