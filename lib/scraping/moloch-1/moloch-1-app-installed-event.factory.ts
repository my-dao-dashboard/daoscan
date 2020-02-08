import { Inject, Service } from "typedi";
import { Block } from "../block";
import { AppInstalledEvent, AppInstalledEventProps } from "../events/app-installed.event";
import { logEvents } from "../events-from-logs";
import { PLATFORM } from "../../domain/platform";
import { EthereumService } from "../../services/ethereum.service";
import { ConnectionFactory } from "../../storage/connection.factory";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { SUMMON_COMPLETE_BLOCKCHAIN_EVENT } from "./summon-complete.blockchain-event";
import { ApplicationRepository } from "../../storage/application.repository";
import { APP_ID } from "../../storage/app-id";

@Service(Moloch1AppInstalledEventFactory.name)
export class Moloch1AppInstalledEventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository
  ) {}

  async fromBlock(block: Block): Promise<AppInstalledEvent[]> {
    const shareApplication = await this.shareApplication(block);
    return shareApplication;
  }

  async shareApplication(block: Block): Promise<AppInstalledEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    return logEvents(this.ethereum.codec, extendedBlock, SUMMON_COMPLETE_BLOCKCHAIN_EVENT).map(e => {
      const organisationAddress = e.address;
      return this.fromJSON({
        platform: PLATFORM.MOLOCH_1,
        organisationAddress: organisationAddress.toLowerCase(),
        proxyAddress: organisationAddress.toLowerCase(),
        appId: APP_ID.SHARE,
        txid: e.txid,
        blockNumber: Number(e.blockNumber),
        blockHash: block.hash,
        timestamp: Number(timestamp)
      });
    });
  }

  fromJSON(json: AppInstalledEventProps) {
    return new AppInstalledEvent(json, this.eventRepository, this.applicationRepository, this.connectionFactory);
  }
}
