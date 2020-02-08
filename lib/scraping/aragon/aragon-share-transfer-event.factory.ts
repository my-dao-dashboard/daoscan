import {Inject, Service} from "typedi";
import {ShareTransferEvent, ShareTransferEventProps} from "../events/share-transfer.event";
import {Block} from "../block";
import {Log} from "web3-core";
import {logEvents} from "../events-from-logs";
import {EthereumService} from "../../services/ethereum.service";
import {BlockchainEvent} from "../blockchain-event";
import {ApplicationRepository} from "../../storage/application.repository";
import {AppInstalledEvent} from "../events/app-installed.event";
import {PLATFORM} from "../../domain/platform";
import _ from "lodash";
import {EventRepository} from "../../storage/event.repository";
import {MembershipRepository} from "../../storage/membership.repository";
import {ConnectionFactory} from "../../storage/connection.factory";
import {APP_ID} from "../../storage/app-id";

export interface TransferParams {
  _from: string;
  _to: string;
  _amount: string;
}

export const TRANSFER_EVENT: BlockchainEvent<TransferParams> = {
  signature: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  abi: [
    { indexed: true, name: "_from", type: "address" },
    { indexed: true, name: "_to", type: "address" },
    { indexed: false, name: "_amount", type: "uint256" }
  ]
};

@Service(AragonShareTransferEventFactory.name)
export class AragonShareTransferEventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory
  ) {}

  async fromBlock(block: Block, appInstalled: AppInstalledEvent[]): Promise<ShareTransferEvent[]> {
    // is Transfer event
    const filter = (log: Log) => {
      return log.topics.length === 3;
    };
    const extendedBlock = await block.extendedBlock();
    const promises = logEvents(this.ethereum.codec, extendedBlock, TRANSFER_EVENT, filter).map<
      Promise<ShareTransferEvent | undefined>
    >(async e => {
      let organisationAddress = await this.applicationRepository.organisationAddressByApplicationAddress(e.address, APP_ID.SHARE);
      if (!organisationAddress) {
        const foundEvent = appInstalled.find(
          a => a.proxyAddress.toLowerCase() === e.address.toLowerCase() && a.appId === APP_ID.SHARE
        );
        if (foundEvent) {
          organisationAddress = foundEvent.organisationAddress;
        }
      }

      if (organisationAddress) {
        return this.fromJSON({
          platform: PLATFORM.ARAGON,
          organisationAddress: organisationAddress.toLowerCase(),
          logIndex: e.logIndex,
          txid: e.txid,
          blockHash: block.hash,
          blockNumber: e.blockNumber,
          shareAddress: e.address.toLowerCase(),
          from: e._from.toLowerCase(),
          to: e._to.toLowerCase(),
          amount: e._amount
        });
      } else {
        return undefined;
      }
    });
    const transfers = await Promise.all(promises);
    return _.compact(_.flatten(transfers));
  }

  fromJSON(json: ShareTransferEventProps): ShareTransferEvent {
    return new ShareTransferEvent(json, this.eventRepository, this.membershipRepository, this.connectionFactory);
  }
}
