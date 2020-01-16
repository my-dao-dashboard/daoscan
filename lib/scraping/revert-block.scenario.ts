import { Inject, Service } from "typedi";
import { Scenario } from "../shared/scenario.interface";
import { EthereumBlockRowRepository } from "../rel-storage/ethereum-block-row.repository";

@Service(RevertBlockScenario.name)
export class RevertBlockScenario implements Scenario<number, void> {
  constructor(
    @Inject(EthereumBlockRowRepository.name) private readonly blockRowRepository: EthereumBlockRowRepository
  ) {}

  async execute(id: number): Promise<void> {
    console.log(`Reverting block #${id}`);
    await this.blockRowRepository.delete(id);
  }
}
