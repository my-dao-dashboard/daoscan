import { ExtendedBlock } from "../ethereum.service";
import { KIT_ADDRESSES, KIT_SIGNATURES } from "./aragon.constants";
import {
  ORGANISATION_EVENT,
  ORGANISATION_PLATFORM,
  OrganisationCreatedEvent,
  OrganisationEvent
} from "../organisation";
import Web3 from "web3";
import { IScraper } from "./scraper.interface";

export class AragonScraper implements IScraper {
  constructor(private readonly web3: Web3) {}

  async fromBlock(block: ExtendedBlock): Promise<OrganisationEvent[]> {
    return this.createdEvents(block);
  }

  async createdEvents(block: ExtendedBlock): Promise<OrganisationCreatedEvent[]> {
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
            address: address,
            txid: t.transactionHash
          };
          return event;
        })
    );
  }
}
