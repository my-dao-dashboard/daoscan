import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { logEvents } from "../events-from-logs";
import { SUMMON_COMPLETE_BLOCKCHAIN_EVENT } from "./summon-complete.blockchain-event";
import { PLATFORM } from "../../domain/platform";
import { EthereumService } from "../../services/ethereum.service";
import { OrganisationCreatedEvent } from "../events/organisation-created.event";
import { ConnectionFactory } from "../../storage/connection.factory";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { AppInstalledEvent, AppInstalledEventProps } from "../events/app-installed.event";
import { APP_ID } from "../../storage/app-id";
import { ApplicationRepository } from "../../storage/application.repository";
import { MOLOCH_1_ABI } from "./moloch-1.abi";

@Service(Moloch1EventFactory.name)
export class Moloch1EventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreatedFromBlock(block);
    const appInstalledEvents = await this.appInstalledEvents(organisationCreatedEvents);
    let result = new Array<ScrapingEvent>();
    return result.concat(organisationCreatedEvents).concat(appInstalledEvents);
  }

  async appInstalledEvents(organisationCreatedEvents: OrganisationCreatedEvent[]): Promise<AppInstalledEvent[]> {
    const shares = await this.sharesInstalled(organisationCreatedEvents);
    const banks = await this.guildBankInstalled(organisationCreatedEvents);
    return shares.concat(banks);
  }

  async guildBankInstalled(organisationCreatedEvents: OrganisationCreatedEvent[]): Promise<AppInstalledEvent[]> {
    const banksPromised = organisationCreatedEvents.map(async event => {
      const molochContract = this.ethereum.contract(MOLOCH_1_ABI, event.address);
      const guildBankAddress = await molochContract.methods.guildBank().call();
      const props: AppInstalledEventProps = {
        platform: PLATFORM.MOLOCH_1,
        organisationAddress: event.address.toLowerCase(),
        proxyAddress: guildBankAddress,
        appId: APP_ID.MOLOCH_1_BANK,
        txid: event.txid,
        blockNumber: Number(event.blockNumber),
        blockHash: event.blockHash,
        timestamp: event.timestamp
      };
      return new AppInstalledEvent(props, this.eventRepository, this.applicationRepository, this.connectionFactory);
    });
    return Promise.all(banksPromised);
  }

  async sharesInstalled(organisationCreatedEvents: OrganisationCreatedEvent[]): Promise<AppInstalledEvent[]> {
    return organisationCreatedEvents.map(event => {
      const props: AppInstalledEventProps = {
        platform: PLATFORM.MOLOCH_1,
        organisationAddress: event.address.toLowerCase(),
        proxyAddress: event.address.toLowerCase(),
        appId: APP_ID.SHARE,
        txid: event.txid,
        blockNumber: Number(event.blockNumber),
        blockHash: event.blockHash,
        timestamp: event.timestamp
      };
      return new AppInstalledEvent(props, this.eventRepository, this.applicationRepository, this.connectionFactory);
    });
  }

  async organisationCreatedFromBlock(block: Block): Promise<OrganisationCreatedEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    return logEvents(this.ethereum.codec, extendedBlock, SUMMON_COMPLETE_BLOCKCHAIN_EVENT).map(e => {
      const organisationAddress = e.address;
      const props = {
        platform: PLATFORM.MOLOCH_1,
        name: organisationAddress.toLowerCase(),
        address: organisationAddress.toLowerCase(),
        txid: e.txid,
        blockNumber: Number(e.blockNumber),
        blockHash: block.hash,
        timestamp: Number(timestamp)
      };
      return new OrganisationCreatedEvent(
        props,
        this.eventRepository,
        this.organisationRepository,
        this.connectionFactory
      );
    });
  }
}
