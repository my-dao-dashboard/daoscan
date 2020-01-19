import { BadRequestError } from "../shared/errors";
import { Block } from "./block";
import { Inject, Service } from "typedi";
import { BlockAddScenario } from "./block-add.scenario";

export class BlockAddEvent {
  constructor(readonly id: bigint, private readonly blockAddScenario: BlockAddScenario) {}

  toJSON() {
    return {
      id: this.id.toString()
    };
  }

  async commit() {
    await this.blockAddScenario.execute(this);
  }
}

@Service(BlockAddEventFactory.name)
export class BlockAddEventFactory {
  constructor(@Inject(BlockAddScenario.name) private readonly blockAddScenario: BlockAddScenario) {}

  fromBlock(block: Block): BlockAddEvent {
    return new BlockAddEvent(block.id, this.blockAddScenario);
  }

  fromString(payload: string | null): BlockAddEvent {
    if (payload) {
      const parsed = JSON.parse(payload);
      if (parsed.id) {
        return new BlockAddEvent(BigInt(parsed.id), this.blockAddScenario);
      }
    }
    throw new BadRequestError(`Expect BlockAddEvent in payload`);
  }
}
