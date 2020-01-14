import { Inject, Service } from "typedi";
import { EthereumService } from "../services/ethereum.service";
import { EthereumBlock } from "./ethereum-block";

@Service(EthereumBlockFactory.name)
export class EthereumBlockFactory {
  constructor(@Inject(EthereumService.name) private readonly ethereumService: EthereumService) {}

  async latest(): Promise<EthereumBlock> {
    const extendedBlock = await this.ethereumService.extendedBlock("latest");
    return new EthereumBlock(extendedBlock);
  }
}
