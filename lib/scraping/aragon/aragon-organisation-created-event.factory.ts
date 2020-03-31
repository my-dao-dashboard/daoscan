import { Inject, Service } from "typedi";
import { EthereumService } from "../../services/ethereum.service";
import { PLATFORM } from "../../domain/platform";
import { Block } from "../block";
import { ConnectionFactory } from "../../storage/connection.factory";
import { logEvents } from "../events-from-logs";
import { BlockchainEvent } from "../blockchain-event";
import { OrganisationCreatedEvent, OrganisationCreatedEventProps } from "../events/organisation-created.event";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationStorage } from "../../storage/organisation.storage";
import { HistoryRepository } from "../../storage/history.repository";

interface DeployInstanceParams {
  dao: string;
}

const DEPLOY_INSTANCE_EVENT_BUNCH = new Map<string, string>([
  // DAOFactory
  ["0xb9dA44C051C6cC9E04b7E0F95E95d69c6A6D8031", "0x3a7eb042a769adf51e9be78b68ed7af0ad7b379246536efc376ed2ca01238282"],
  ["0xc29f0599DF12EB4Cbe1a34354c4BaC6D944071d1", "0x3a7eb042a769adf51e9be78b68ed7af0ad7b379246536efc376ed2ca01238282"]
]);

@Service(AragonOrganisationCreatedEventFactory.name)
export class AragonOrganisationCreatedEventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationStorage.name) private readonly organisationStorage: OrganisationStorage,
    @Inject(HistoryRepository.name) private readonly historyRepository: HistoryRepository
  ) {}

  async fromDeployInstanceBunch(block: Block): Promise<OrganisationCreatedEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    let result: OrganisationCreatedEvent[] = [];
    DEPLOY_INSTANCE_EVENT_BUNCH.forEach((signature, source) => {
      const event: BlockchainEvent<DeployInstanceParams> = {
        sources: [source],
        signature: signature,
        abi: [{ indexed: false, name: "dao", type: "address" }]
      };
      const events = logEvents(this.ethereum.codec, extendedBlock, event).map(e => {
        const organisationAddress = e.dao;
        return this.fromJSON({
          platform: PLATFORM.ARAGON,
          name: organisationAddress.toLowerCase(),
          address: organisationAddress.toLowerCase(),
          txid: e.txid,
          blockNumber: Number(e.blockNumber),
          blockHash: block.hash,
          timestamp: Number(timestamp)
        });
      });
      result = result.concat(events);
    });
    return result;
  }

  fromJSON(json: OrganisationCreatedEventProps) {
    return new OrganisationCreatedEvent(
      json,
      this.eventRepository,
      this.organisationStorage,
      this.historyRepository,
      this.connectionFactory
    );
  }

  async fromBlock(block: Block): Promise<OrganisationCreatedEvent[]> {
    return this.fromDeployInstanceBunch(block);
  }
}
