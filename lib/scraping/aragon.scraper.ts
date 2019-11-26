import { ExtendedBlock } from "../ethereum.service";
import { KIT_ADDRESSES, KIT_SIGNATURES, NEW_APP_PROXY_EVENT } from "./aragon.constants";
import {
  ORGANISATION_EVENT,
  ORGANISATION_PLATFORM,
  OrganisationCreatedEvent,
  OrganisationEvent
} from "../organisation-events";
import Web3 from "web3";
import { Scraper } from "./scraper.interface";
import { Indexed } from "../indexed.interface";
import { BlockchainEvent } from "./blockchain-event.interface";

export class AragonScraper implements Scraper {
  constructor(private readonly web3: Web3) {}

  async fromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]> {
    const created = await this.createdFromTransactions(block);
    const appInstalled = await this.appInstalledEvents(block);

    return created.concat(appInstalled);
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

  async createdFromTransactions(block: ExtendedBlock): Promise<OrganisationEvent[]> {
    const whitelist = KIT_ADDRESSES;
    const abiMap = KIT_SIGNATURES;
    return Promise.all(
      block.receipts
        .filter(t => whitelist.has(t.to.toLowerCase()) || whitelist.size === 0)
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

  async appInstalledEvents(block: ExtendedBlock): Promise<OrganisationEvent[]> {
    const appInstalledPromised = this.logEvents(block, NEW_APP_PROXY_EVENT).map<Promise<OrganisationEvent>>(async e => {
      const organisationAddress = await this.kernelAddress(e.proxy)
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
    return Promise.all(appInstalledPromised);
  }

  logEvents<A extends Indexed<string>>(
    block: ExtendedBlock,
    event: BlockchainEvent<A>
  ): (A & { txid: string; blockNumber: number })[] {
    return block.logs
      .filter(log => log.topics[0] === event.signature)
      .map(log => {
        return {
          ...(this.web3.eth.abi.decodeLog(event.abi, log.data, log.topics) as A),
          txid: log.transactionHash,
          blockNumber: block.number
        };
      });
  }
}
