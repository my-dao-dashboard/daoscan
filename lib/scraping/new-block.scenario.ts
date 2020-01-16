import { Scenario } from "../shared/scenario.interface";
import { OrganisationEvent } from "../shared/organisation-events";
import { Inject, Service } from "typedi";
import { AddBlockScenario } from "./add-block.scenario";
import { RevertBlockScenario } from "./revert-block.scenario";
import { EthereumBlockRowRepository } from "../rel-storage/ethereum-block-row.repository";
import { EthereumService } from "../services/ethereum.service";

@Service(NewBlockScenario.name)
export class NewBlockScenario implements Scenario<string, OrganisationEvent[]> {
  constructor(
    @Inject(AddBlockScenario.name) private readonly addBlockScenario: AddBlockScenario,
    @Inject(RevertBlockScenario.name) private readonly revertBlockScenario: RevertBlockScenario,
    @Inject(EthereumBlockRowRepository.name) private readonly blocksRepository: EthereumBlockRowRepository,
    @Inject(EthereumService.name) private readonly ethereumService: EthereumService
  ) {}

  async isReorg(id: number) {
    const found = await this.blocksRepository.byId(id);
    if (!found) return false;
    const block = await this.ethereumService.block(id);
    return block.hash.toLowerCase() != found.hash.toLowerCase();
  }

  async revertBlock(id: number) {
    await this.revertBlockScenario.execute(id);
  }

  async addBlock(id: number) {
    return this.addBlockScenario.execute(id);
  }

  async execute(payload: string): Promise<OrganisationEvent[]> {
    const data = JSON.parse(payload);
    const id = Number(data.id);
    const isReorg = await this.isReorg(id);
    if (isReorg) {
      await this.revertBlock(id);
    }
    const events = await this.addBlock(id);
    console.log("Got events:", events);
    return events;
  }
}
