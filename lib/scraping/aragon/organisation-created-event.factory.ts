import { Inject, Service } from "typedi";
import { EthereumService, ExtendedTransactionReceipt } from "../../services/ethereum.service";
import { AbiInput } from "web3-utils";
import { PLATFORM } from "../../domain/platform";
import { Block } from "../block";
import { ConnectionFactory } from "../../storage/connection.factory";
import { SCRAPING_EVENT_KIND } from "../events/scraping-event.interface";
import { OrganisationCreatedEvent } from "../events/scraping-event";
import { logEvents } from "./events-from-logs";
import { BlockchainEvent } from "../blockchain-event";

export const KIT_ADDRESSES = new Set(
  [
    "0x705Cd9a00b87Bb019a87beEB9a50334219aC4444", // Democracy 1 (0.6)
    "0x41bbaf498226b68415f1C78ED541c45A18fd7696", // Multisig 1 (0.6)
    "0x7f3ed10366826a1227025445D4f4e3e14BBfc91d", // Democracy 2 (0.7)
    "0x87aa2980dde7d2D4e57191f16BB57cF80bf6E5A6", // Multisig 2 (0.7)
    "0x4d1A892f42c947fa952b57bc6939b27A96215CfA", // Company Board (0.8)
    "0xd737632caC4d039C9B0EEcc94C12267407a271b5", // Company (0.8)
    "0x67430642C0c3B5E6538049B9E9eE719f2a4BeE7c", // Membership (0.8)
    "0x3a06A6544e48708142508D9042f94DDdA769d04F", // Reputation (0.8)
    "0xc54c5dB63aB0E79FBb9555373B969093dEb17859" // Open Enterprise (0.8.4)
  ].map(a => a.toLowerCase())
);

export const KIT_SIGNATURES = new Map<string, AbiInput[]>([
  // Democracy (0.6-0.7)
  [
    "0xf1868e8b",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "holders",
        type: "address[]"
      },
      {
        name: "tokens",
        type: "uint256[]"
      },
      {
        name: "supportNeeded",
        type: "uint64"
      },
      {
        name: "minAcceptanceQuorum",
        type: "uint64"
      },
      {
        name: "voteDuration",
        type: "uint64"
      }
    ]
  ],

  // Multisig (0.6-0.7)
  [
    "0xa0fd20de",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "signers",
        type: "address[]"
      },
      {
        name: "neededSignatures",
        type: "uint256"
      }
    ]
  ],

  // Company (0.8)
  // Reputation (0.8)
  [
    "0x885b48e7",
    [
      {
        name: "tokenName",
        type: "string"
      },
      {
        name: "tokenSymbol",
        type: "string"
      },
      {
        name: "name",
        type: "string"
      },
      {
        name: "holders",
        type: "address[]"
      },
      {
        name: "stakes",
        type: "uint256[]"
      },
      {
        name: "votingSettings",
        type: "uint64[3]"
      },
      {
        name: "financePeriod",
        type: "uint64"
      },
      {
        name: "useAgentAsVault",
        type: "bool"
      }
    ]
  ],

  // Company (0.8)
  // Reputation (0.8)
  [
    "0x0eb8e519",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "holders",
        type: "address[]"
      },
      {
        name: "stakes",
        type: "uint256[]"
      },
      {
        name: "votingSettings",
        type: "uint64[3]"
      },
      {
        name: "financePeriod",
        type: "uint64"
      },
      {
        name: "useAgentAsVault",
        type: "bool"
      }
    ]
  ],

  // Company (0.8)
  // Reputation (0.8)
  [
    "0xe2234b49",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "holders",
        type: "address[]"
      },
      {
        name: "stakes",
        type: "uint256[]"
      },
      {
        name: "votingSettings",
        type: "uint64[3]"
      },
      {
        name: "financePeriod",
        type: "uint64"
      },
      {
        name: "useAgentAsVault",
        type: "bool"
      },
      {
        name: "payrollSettings",
        type: "uint256[4]"
      }
    ]
  ],

  // Company Board (0.8)
  [
    "0xab788d86",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "shareHolders",
        type: "address[]"
      },
      {
        name: "shareStakes",
        type: "uint256[]"
      },
      {
        name: "boardMembers",
        type: "address[]"
      },
      {
        name: "useAgentAsVault",
        type: "bool"
      }
    ]
  ],

  // Company Board (0.8)
  [
    "0x700a34fa",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "shareHolders",
        type: "address[]"
      },
      {
        name: "shareStakes",
        type: "uint256[]"
      },
      {
        name: "boardMembers",
        type: "address[]"
      },
      {
        name: "useAgentAsVault",
        type: "bool"
      },
      {
        name: "payrollSettings",
        type: "uint256[4]"
      }
    ]
  ],

  // Membership (0.8)
  [
    "0x8a29ac04",
    [
      {
        name: "tokenName",
        type: "string"
      },
      {
        name: "tokenSymbol",
        type: "string"
      },
      {
        name: "name",
        type: "string"
      },
      {
        name: "members",
        type: "address[]"
      },
      {
        name: "votingSettings",
        type: "uint64[3]"
      },
      {
        name: "financePeriod",
        type: "uint64"
      },
      {
        name: "useAgentAsVault",
        type: "bool"
      }
    ]
  ],

  // Membership (0.8)
  [
    "0xce489612",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "members",
        type: "address[]"
      },
      {
        name: "votingSettings",
        type: "uint64[3]"
      },
      {
        name: "payrollSettings",
        type: "uint256[4]"
      }
    ]
  ],

  // Membership (0.8)
  [
    "0x2ce4ea94",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "members",
        type: "address[]"
      },
      {
        name: "votingSettings",
        type: "uint64[3]"
      },
      {
        name: "financePeriod",
        type: "uint64"
      },
      {
        name: "useAgentAsVault",
        type: "bool"
      },
      {
        name: "payrollSettings",
        type: "uint256[4]"
      }
    ]
  ],

  // Open Enterprise (0.8.4)
  [
    "0xa0f6918d",
    [
      {
        name: "tokenName",
        type: "string"
      },
      {
        name: "tokenSymbol",
        type: "string"
      },
      {
        name: "name",
        type: "string"
      },
      {
        name: "members",
        type: "address[]"
      },
      {
        name: "stakes",
        type: "uint256[]"
      },
      {
        name: "votingSettings",
        type: "uint64[3]"
      },
      {
        name: "financePeriod",
        type: "uint64"
      }
    ]
  ]
]);

export interface DeployInstanceParams {
  dao: string;
}

export const DEPLOY_INSTANCE_EVENT: BlockchainEvent<DeployInstanceParams> = {
  signature: "0x8f42a14c9fe9e09f4fe8eeee69ae878731c838b6497425d4c30e1d09336cf34b",
  abi: [{ indexed: false, name: "dao", type: "address" }]
};

@Service(OrganisationCreatedEventFactory.name)
export class OrganisationCreatedEventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory
  ) {}

  isSuitableReceipt(receipt: ExtendedTransactionReceipt): boolean {
    const destination = receipt.to?.toLowerCase();
    return Boolean(destination) && KIT_ADDRESSES.has(destination) && KIT_SIGNATURES.has(receipt.input.slice(0, 10));
  }

  async fromReceipt(block: Block, receipt: ExtendedTransactionReceipt): Promise<OrganisationCreatedEvent> {
    const signature = receipt.input.slice(0, 10);
    const abi = KIT_SIGNATURES.get(signature)!;
    const parameters = this.ethereum.codec.decodeParameters(abi, "0x" + receipt.input.slice(10));
    const ensName = `${parameters.name}.aragonid.eth`;
    const address = await this.ethereum.canonicalAddress(ensName);
    const timestamp = await block.timestamp();
    return {
      kind: SCRAPING_EVENT_KIND.ORGANISATION_CREATED,
      platform: PLATFORM.ARAGON,
      name: ensName,
      address: address.toLowerCase(),
      txid: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber),
      blockHash: receipt.blockHash,
      timestamp: Number(timestamp)
    };
  }

  async fromTransactions(block: Block): Promise<OrganisationCreatedEvent[]> {
    const receipts = await block.receipts();
    const suitableReceipts = receipts.filter(r => this.isSuitableReceipt(r));
    return Promise.all(
      suitableReceipts.map(async receipt => {
        return await this.fromReceipt(block, receipt);
      })
    );
  }

  async fromEvents(block: Block): Promise<OrganisationCreatedEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    return logEvents(this.ethereum.codec, extendedBlock, DEPLOY_INSTANCE_EVENT).map(e => {
      const organisationAddress = e.dao;
      return {
        kind: SCRAPING_EVENT_KIND.ORGANISATION_CREATED,
        platform: PLATFORM.ARAGON,
        name: organisationAddress.toLowerCase(),
        address: organisationAddress.toLowerCase(),
        txid: e.txid,
        blockNumber: Number(e.blockNumber),
        blockHash: block.hash,
        timestamp: Number(timestamp)
      };
    });
  }

  async fromBlock(block: Block): Promise<OrganisationCreatedEvent[]> {
    const fromTransactions = await this.fromTransactions(block);
    const fromEvents = await this.fromEvents(block);
    return fromTransactions.concat(fromEvents);
  }
}
