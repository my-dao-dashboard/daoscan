import { ExtendedBlock } from "../ethereum.service";
import {
  KIT_ADDRESSES,
  KIT_SIGNATURES,
  NEW_APP_PROXY_EVENT,
  TOKEN_CONTROLLER_ABI,
  TRANSFER_EVENT
} from "./aragon.constants";
import {
  AppInstalledEvent,
  ORGANISATION_EVENT,
  ORGANISATION_PLATFORM,
  OrganisationCreatedEvent,
  OrganisationEvent,
  ShareTransferEvent
} from "../organisation-events";
import Web3 from "web3";
import { Scraper } from "./scraper.interface";
import { Indexed } from "../indexed.interface";
import { BlockchainEvent } from "./blockchain-event.interface";
import { DynamoService } from "../storage/dynamo.service";
import * as _ from "lodash";
import { Log } from "web3-core";

const APPLICATIONS_TABLE = String(process.env.APPLICATIONS_TABLE);
const APPLICATIONS_PER_ADDRESS_INDEX = String(process.env.APPLICATIONS_PER_ADDRESS_INDEX);

export class AragonScraper implements Scraper {
  constructor(private readonly web3: Web3, private readonly dynamo: DynamoService) {}

  async fromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]> {
    const created = await this.createdFromTransactions(block);
    const appInstalled = await this.appInstalledEvents(block);
    const transfers = await this.transfers(block, appInstalled);

    const result = [] as OrganisationEvent[];

    return result
      .concat(created)
      .concat(appInstalled)
      .concat(transfers);
  }

  async transfers(block: ExtendedBlock, appInstalled: AppInstalledEvent[]): Promise<OrganisationEvent[]> {
    // is Transfer event
    const filter = (log: Log) => {
      return log.topics.length === 3;
    };
    const promises = this.logEvents(block, TRANSFER_EVENT, filter).map<Promise<ShareTransferEvent | null>>(async e => {
      const dynamoResponse = await this.dynamo.query({
        TableName: APPLICATIONS_TABLE,
        IndexName: APPLICATIONS_PER_ADDRESS_INDEX,
        ProjectionExpression: "proxyAddress, appId, organisationAddress",
        KeyConditionExpression: "proxyAddress = :proxyAddress",
        ExpressionAttributeValues: {
          ":proxyAddress": e.address
        }
      });
      const items = dynamoResponse.Items;
      let organisationAddress = items?.length ? items[0].organisationAddress.toLowerCase() : null;
      if (!organisationAddress) {
        const foundEvent = appInstalled.find(a => a.proxyAddress === e.address);
        if (foundEvent) {
          organisationAddress = foundEvent.organisationAddress;
        }
      }

      if (organisationAddress) {
        return {
          kind: ORGANISATION_EVENT.TRANSFER_SHARE,
          platform: ORGANISATION_PLATFORM.ARAGON,
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
    const data = this.web3.eth.abi.encodeFunctionCall(
      {
        name: "kernel",
        type: "function",
        inputs: []
      },
      []
    );
    const result = await this.web3.eth.call({
      to: proxy,
      data
    });
    return this.web3.eth.abi.decodeParameter("address", result) as any;
  }

  async createdFromTransactions(block: ExtendedBlock): Promise<OrganisationCreatedEvent[]> {
    const whitelist = KIT_ADDRESSES;
    const abiMap = KIT_SIGNATURES;
    return Promise.all(
      block.receipts
        .filter(t => t.to && (whitelist.has(t.to.toLowerCase()) || whitelist.size === 0))
        .filter(t => abiMap.has(t.input.slice(0, 10)))
        .map(async t => {
          const signature = t.input.slice(0, 10);
          const abi = abiMap.get(signature)!;
          const parameters = this.web3.eth.abi.decodeParameters(abi, "0x" + t.input.slice(10));
          const ensName = `${parameters.name}.aragonid.eth`;
          const address = await this.web3.eth.ens.getAddress(ensName);

          const event: OrganisationCreatedEvent = {
            kind: ORGANISATION_EVENT.CREATED,
            platform: ORGANISATION_PLATFORM.ARAGON,
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

  async appInstalledEvents(block: ExtendedBlock): Promise<AppInstalledEvent[]> {
    const appInstalledPromised = this.logEvents(block, NEW_APP_PROXY_EVENT).map<Promise<AppInstalledEvent>>(async e => {
      const organisationAddress = await this.kernelAddress(e.proxy);
      return {
        kind: ORGANISATION_EVENT.APP_INSTALLED,
        platform: ORGANISATION_PLATFORM.ARAGON,
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
      return e.appId === "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f";
    });
    for (let e of tokenControllerEvents) {
      const tokenControllerAddress = e.proxyAddress;
      const tokenController = new this.web3.eth.Contract(TOKEN_CONTROLLER_ABI, tokenControllerAddress);
      const tokenAddress = await tokenController.methods.token().call();
      const tokenEvent: AppInstalledEvent = {
        kind: ORGANISATION_EVENT.APP_INSTALLED,
        platform: ORGANISATION_PLATFORM.ARAGON,
        organisationAddress: e.organisationAddress,
        appId: "ds:share",
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
          ...(this.web3.eth.abi.decodeLog(event.abi, log.data, log.topics.slice(1)) as A),
          address: log.address,
          txid: log.transactionHash,
          logIndex: log.logIndex,
          blockNumber: block.number
        };
      });
  }
}
