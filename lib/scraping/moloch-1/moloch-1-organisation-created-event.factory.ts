import { Inject, Service } from "typedi";
import { Block } from "../block";
import { OrganisationCreatedEvent, OrganisationCreatedEventProps } from "../events/organisation-created.event";
import { logEvents } from "../aragon/events-from-logs";
import { PLATFORM } from "../../domain/platform";
import { EthereumService } from "../../services/ethereum.service";
import { BlockchainEvent } from "../aragon/blockchain-event";
import { ConnectionFactory } from "../../storage/connection.factory";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationRepository } from "../../storage/organisation.repository";

interface SummonCompleteParams {
  summoner: string;
  shares: string;
}

const SUMMON_COMPLETE_EVENT: BlockchainEvent<SummonCompleteParams> = {
  signature: "0x03995a801b13c36325306deef859ef977ce61c6e15a794281bf969d204825227",
  abi: [
    { indexed: true, name: "summoner", type: "address" },
    { indexed: false, name: "shares", type: "uint256" }
  ]
};

@Service(Moloch1OrganisationCreatedEventFactory.name)
export class Moloch1OrganisationCreatedEventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository
  ) {}

  async fromBlock(block: Block): Promise<OrganisationCreatedEvent[]> {
    return this.fromEvents(block);
  }

  async fromEvents(block: Block): Promise<OrganisationCreatedEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    return logEvents(this.ethereum.codec, extendedBlock, SUMMON_COMPLETE_EVENT).map(e => {
      const organisationAddress = e.address;
      return this.fromJSON({
        platform: PLATFORM.MOLOCH_1,
        name: organisationAddress.toLowerCase(),
        address: organisationAddress.toLowerCase(),
        txid: e.txid,
        blockNumber: Number(e.blockNumber),
        blockHash: block.hash,
        timestamp: Number(timestamp)
      });
    });
  }

  fromJSON(json: OrganisationCreatedEventProps) {
    return new OrganisationCreatedEvent(
      json,
      this.eventRepository,
      this.organisationRepository,
      this.connectionFactory
    );
  }
}
