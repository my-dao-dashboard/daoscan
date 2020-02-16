import { Inject, Service } from "typedi";
import { EthereumService } from "../../services/ethereum.service";
import { PLATFORM } from "../../domain/platform";
import { Block } from "../block";
import { ConnectionFactory } from "../../storage/connection.factory";
import { logEvents } from "../events-from-logs";
import { BlockchainEvent } from "../blockchain-event";
import { OrganisationCreatedEvent, OrganisationCreatedEventProps } from "../events/organisation-created.event";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { HistoryRepository } from "../../storage/history.repository";

interface DeployInstanceParams {
  dao: string;
}

const DEPLOY_INSTANCE_EVENT_BUNCH = new Map<string, string>([
  // Bare Template
  // ["0x772e046Dc341bc197c6Ef1EE083e1a1368d65646", "0x17592627a66846ce06d92a1708275bc653b2a3f34aec855584b819872a8ba413"],
  // Fundraising Template
  // ["0xd4bc1afd46e744f1834cad01b2262d095dcb6c9b", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
  // Membership Template
  // ["0x67430642C0c3B5E6538049B9E9eE719f2a4BeE7c", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
  // EOPBCTemplate
  // ["0xF5Fc4Ca75534e13d8120D8405e0d7D4662848592", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5F"],
  // ReputationTemplate
  // ["0x3a06A6544e48708142508D9042f94DDdA769d04F", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
  // Whatever
  // ["0xDe40122f2a86Db6Af51E20C79653F6cB8b30eda0", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
  // ["0x595b34c93aa2c2ba0a38daeede629a0dfbdcc559", "0x3a7eb042a769adf51e9be78b68ed7af0ad7b379246536efc376ed2ca01238282"],
  // ["0xc29f0599DF12EB4Cbe1a34354c4BaC6D944071d1", "0x3a7eb042a769adf51e9be78b68ed7af0ad7b379246536efc376ed2ca01238282"],
  // ["0xEEd831F3524e9B954AE148FA5C15D5E91e16aD94", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
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
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
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

  async fromDeployInstanceEvent(
    block: Block,
    event: BlockchainEvent<DeployInstanceParams>
  ): Promise<OrganisationCreatedEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    return logEvents(this.ethereum.codec, extendedBlock, event).map(e => {
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
  }

  fromJSON(json: OrganisationCreatedEventProps) {
    return new OrganisationCreatedEvent(
      json,
      this.eventRepository,
      this.organisationRepository,
      this.historyRepository,
      this.connectionFactory
    );
  }

  async fromBlock(block: Block): Promise<OrganisationCreatedEvent[]> {
    return this.fromDeployInstanceBunch(block);
  }
}
