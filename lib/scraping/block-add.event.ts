import { BadRequestError } from "../shared/errors";
import { Block } from "./block";
import { Inject, Service } from "typedi";
import { BlockAddScenario } from "./block-add.scenario";

export class BlockAddEvent {
  constructor(readonly id: bigint) {}

  toJSON() {
    return {
      id: this.id.toString()
    };
  }
}

@Service(BlockAddEventFactory.name)
export class BlockAddEventFactory {
  constructor(@Inject(BlockAddScenario.name) private readonly blockAddScenario: BlockAddScenario) {}

  fromBlock(block: Block): BlockAddEvent {
    return new BlockAddEvent(block.id);
  }

  fromString(payload: string | null): BlockAddEvent {
    if (payload) {
      const parsed = JSON.parse(payload);
      if (parsed.id) {
        return this.fromId(parsed.id);
      }
    }
    throw new BadRequestError(`Expect BlockAddEvent in payload`);
  }

  fromId(blockId: number | bigint) {
    return new BlockAddEvent(BigInt(blockId));
  }
}
