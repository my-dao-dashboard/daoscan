import { Indexed } from "../shared/indexed";
import { ExtendedBlock } from "../services/ethereum.service";
import { BlockchainEvent } from "./blockchain-event";
import { Log } from "web3-core";
import { AbiCodec } from "../services/abi-codec";

export type LogEvent<A> = A & { txid: string; blockNumber: number; address: string; logIndex: number };

export function logEvents<A extends Indexed<string>>(
  codec: AbiCodec,
  block: ExtendedBlock,
  event: BlockchainEvent<A>,
  filter?: (log: Log) => boolean
): LogEvent<A>[] {
  const destinations = event.contracts?.map(c => c.toLowerCase());
  return block.logs
    .filter(log => {
      const isRemoved = (log as any).removed;
      const isKnown = log.topics[0] === event.signature;
      const isFiltered = filter ? filter(log) : true;
      const isDirected = destinations ? destinations.includes(log.address.toLowerCase()) : true;
      return !isRemoved && isKnown && isFiltered && isDirected;
    })
    .map(log => {
      return {
        ...(codec.decodeLog(event.abi, log.data, log.topics.slice(1)) as A),
        address: log.address,
        txid: log.transactionHash.toLowerCase(),
        logIndex: log.logIndex,
        blockNumber: Number(block.number)
      };
    });
}
