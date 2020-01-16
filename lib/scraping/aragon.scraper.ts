import { EthereumService, ExtendedBlock } from "../services/ethereum.service";
import {
  DEPLOY_INSTANCE_EVENT,
  KIT_ADDRESSES,
  KIT_SIGNATURES,
  NEW_APP_PROXY_EVENT,
  TOKEN_CONTROLLER_ABI,
  TRANSFER_EVENT
} from "./aragon.constants";
import {
  AppInstalledEvent,
  ORGANISATION_EVENT,
  OrganisationCreatedEvent,
  OrganisationEvent,
  ShareTransferEvent
} from "../shared/organisation-events";
import Web3 from "web3";
import { Scraper } from "./scraper.interface";
import { Indexed } from "./indexed.interface";
import { BlockchainEvent } from "./blockchain-event.interface";
import * as _ from "lodash";
import { Log } from "web3-core";
import { APP_ID } from "../shared/app-id.const";
import { PLATFORM } from "../shared/platform";
import { ApplicationsRepository } from "../storage/applications.repository";

export class AragonScraper implements Scraper {
  constructor(
    private readonly web3: Web3,
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly ethereum: EthereumService
  ) {}

  async fromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]> {
    const createdFromTransaction = await this.createdFromTransactions(block);
    const createdFromEvents = await this.createdFromEvents(block);
    const appInstalled = await this.appInstalledEvents(block);
    const transfers = await this.transfers(block, appInstalled);

    const result = [] as OrganisationEvent[];

    return result
      .concat(createdFromEvents)
      .concat(createdFromTransaction)
      .concat(appInstalled)
      .concat(transfers);
  }

  async transfers(block: ExtendedBlock, appInstalled: AppInstalledEvent[]): Promise<OrganisationEvent[]> {
    // is Transfer event
    const filter = (log: Log) => {
      return log.topics.length === 3;
    };
    const promises = this.logEvents(block, TRANSFER_EVENT, filter).map<Promise<ShareTransferEvent | null>>(async e => {
      let organisationAddress = await this.applicationsRepository.organisationAddressByApplicationAddress(e.address);
      if (!organisationAddress) {
        const foundEvent = appInstalled.find(a => a.proxyAddress.toLowerCase() === e.address.toLowerCase());
        if (foundEvent) {
          organisationAddress = foundEvent.organisationAddress;
        }
      }

      if (organisationAddress) {
        return {
          kind: ORGANISATION_EVENT.TRANSFER_SHARE,
          platform: PLATFORM.ARAGON,
          organisationAddress: organisationAddress.toLowerCase(),
          logIndex: e.logIndex,
          txid: e.txid,
          blockNumber: e.blockNumber,
          shareAddress: e.address.toLowerCase(),
          from: e._from.toLowerCase(),
          to: e._to.toLowerCase(),
          amount: e._amount
        };
      } else {
        return null;
      }
    });
    const transfers = await Promise.all(promises);
    return _.compact(_.flatten(transfers));
  }

  async kernelAddress(proxy: string): Promise<string> {
    const data = this.ethereum.codec.encodeFunctionCall(
      {
        name: "kernel",
        type: "function",
        inputs: []
      },
      []
    );
    const result = await this.ethereum.call({
      to: proxy,
      data
    });
    return this.ethereum.codec.decodeParameter("address", result);
  }

  async createdFromTransactions(block: ExtendedBlock): Promise<OrganisationCreatedEvent[]> {
    const whitelist = KIT_ADDRESSES;
    const abiMap = KIT_SIGNATURES;
    return Promise.all(
      block.receipts
        .filter(t => t.to && (whitelist.has(t.to.toLowerCase()) || whitelist.size === 0))
        .filter(t => abiMap.has(t.input.slice(0, 10)))
        .map(async t => {
          console.log("a");
          const signature = t.input.slice(0, 10);
          console.log("b");
          const abi = abiMap.get(signature)!;
          console.log("c");
          const parameters = this.ethereum.codec.decodeParameters(abi, "0x" + t.input.slice(10));
          console.log("d");
          const ensName = `${parameters.name}.aragonid.eth`;
          console.log("e", ensName);
          const address = await this.ethereum.canonicalAddress(ensName);
          console.log("f");

          const event: OrganisationCreatedEvent = {
            kind: ORGANISATION_EVENT.CREATED,
            platform: PLATFORM.ARAGON,
            name: ensName,
            address: address.toLowerCase(),
            txid: t.transactionHash,
            blockNumber: t.blockNumber,
            timestamp: Number(block.timestamp)
          };
          return event;
        })
    );
  }

  async createdFromEvents(block: ExtendedBlock): Promise<OrganisationCreatedEvent[]> {
    return this.logEvents(block, DEPLOY_INSTANCE_EVENT).map(e => {
      const organisationAddress = e.dao;
      return {
        kind: ORGANISATION_EVENT.CREATED,
        platform: PLATFORM.ARAGON,
        name: organisationAddress.toLowerCase(),
        address: organisationAddress,
        txid: e.txid,
        blockNumber: e.blockNumber,
        timestamp: Number(block.timestamp)
      };
    });
  }

  async appInstalledEvents(block: ExtendedBlock): Promise<AppInstalledEvent[]> {
    const appInstalledPromised = this.logEvents(block, NEW_APP_PROXY_EVENT).map<Promise<AppInstalledEvent>>(async e => {
      const organisationAddress = await this.kernelAddress(e.proxy);
      return {
        kind: ORGANISATION_EVENT.APP_INSTALLED,
        platform: PLATFORM.ARAGON,
        organisationAddress: organisationAddress.toLowerCase(),
        appId: e.appId,
        proxyAddress: e.proxy,
        txid: e.txid,
        blockNumber: e.blockNumber,
        timestamp: Number(block.timestamp)
      };
    });
    const appsInstalled = await Promise.all(appInstalledPromised);
    const tokenControllerEvents = appsInstalled.filter(e => {
      return e.appId === APP_ID.ARAGON_TOKEN_CONTROLLER;
    });
    for (let e of tokenControllerEvents) {
      const tokenControllerAddress = e.proxyAddress;
      const tokenController = this.ethereum.contract(TOKEN_CONTROLLER_ABI, tokenControllerAddress);
      const tokenAddress = await tokenController.methods.token().call();
      const tokenEvent: AppInstalledEvent = {
        kind: ORGANISATION_EVENT.APP_INSTALLED,
        platform: PLATFORM.ARAGON,
        organisationAddress: e.organisationAddress,
        appId: APP_ID.SHARE,
        proxyAddress: tokenAddress,
        txid: e.txid,
        blockNumber: e.blockNumber,
        timestamp: e.timestamp
      };
      appsInstalled.push(tokenEvent);
    }
    return appsInstalled;
  }

  logEvents<A extends Indexed<string>>(
    block: ExtendedBlock,
    event: BlockchainEvent<A>,
    filter?: (log: Log) => boolean
  ): (A & { txid: string; blockNumber: number; address: string; logIndex: number })[] {
    return block.logs
      .filter(log => {
        const isKnown = log.topics[0] === event.signature;
        const isFiltered = filter ? filter(log) : true;
        return isKnown && isFiltered;
      })
      .map(log => {
        return {
          ...(this.ethereum.codec.decodeLog(event.abi, log.data, log.topics.slice(1)) as A),
          address: log.address,
          txid: log.transactionHash,
          logIndex: log.logIndex,
          blockNumber: block.number
        };
      });
  }
}
