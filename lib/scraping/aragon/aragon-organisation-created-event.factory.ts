import { Inject, Service } from "typedi";
import { EthereumService, ExtendedTransactionReceipt } from "../../services/ethereum.service";
import { AbiInput } from "web3-utils";
import { PLATFORM } from "../../domain/platform";
import { Block } from "../block";
import { ConnectionFactory } from "../../storage/connection.factory";
import { logEvents } from "../events-from-logs";
import { BlockchainEvent } from "../blockchain-event";
import { OrganisationCreatedEvent, OrganisationCreatedEventProps } from "../events/organisation-created.event";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { HistoryRepository } from "../../storage/history.repository";

const KIT_ADDRESSES = new Set(
  [
    "0x705Cd9a00b87Bb019a87beEB9a50334219aC4444", // Democracy 1 (0.6)
    "0x41bbaf498226b68415f1C78ED541c45A18fd7696", // Multisig 1 (0.6)
    "0x7f3ed10366826a1227025445D4f4e3e14BBfc91d", // Democracy 2 (0.7)
    "0x87aa2980dde7d2D4e57191f16BB57cF80bf6E5A6", // Multisig 2 (0.7)
    "0x4d1A892f42c947fa952b57bc6939b27A96215CfA", // Company Board (0.8)
    "0xd737632caC4d039C9B0EEcc94C12267407a271b5", // Company (0.8)
    "0x3a06A6544e48708142508D9042f94DDdA769d04F", // Reputation (0.8)
    "0xc54c5dB63aB0E79FBb9555373B969093dEb17859", // Open Enterprise (0.8.4)
    "0xbc2A863ef2B96d454aC7790D5A9E8cFfd8EccBa8" // Dandelion
  ].map(a => a.toLowerCase())
);

const KIT_SIGNATURES = new Map<string, AbiInput[]>([
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
  ],
  // Dandelion: installDandelionApps
  [
    "0xffb94e0e",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "_redemptionsRedeemableTokens",
        type: "address[]"
      },
      {
        name: "_tokenRequestAcceptedDepositTokens",
        type: "address[]"
      },
      {
        name: "_timeLockToken",
        type: "address"
      },
      {
        name: "_timeLockSettings",
        type: "uint256[3]"
      },
      {
        name: "_votingSettings",
        type: "uint64[5]"
      }
    ]
  ]
]);

interface DeployInstanceParams {
  dao: string;
}

const DEPLOY_INSTANCE_EVENT: BlockchainEvent<DeployInstanceParams> = {
  signature: "0x8f42a14c9fe9e09f4fe8eeee69ae878731c838b6497425d4c30e1d09336cf34b",
  abi: [{ indexed: false, name: "dao", type: "address" }]
};

const DEPLOY_INSTANCE_EVENT_BUNCH = new Map<string, string>([
  // Bare Template
  ["0x772e046Dc341bc197c6Ef1EE083e1a1368d65646", "0x17592627a66846ce06d92a1708275bc653b2a3f34aec855584b819872a8ba413"],
  // Fundraising Template
  ["0xd4bc1afd46e744f1834cad01b2262d095dcb6c9b", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
  // Membership Template
  ["0x67430642C0c3B5E6538049B9E9eE719f2a4BeE7c", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
  // Whatever
  ["0xDe40122f2a86Db6Af51E20C79653F6cB8b30eda0", "0x0b13a9ab90735191cd544fd95ba68d1385144561cbdeb8acb8035de9a86432f5"],
  ["0x595b34c93aa2c2ba0a38daeede629a0dfbdcc559", "0x3a7eb042a769adf51e9be78b68ed7af0ad7b379246536efc376ed2ca01238282"],
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

  isSuitableReceipt(receipt: ExtendedTransactionReceipt): boolean {
    const destination = receipt.to?.toLowerCase();
    const status = receipt.status;
    return (
      status && Boolean(destination) && KIT_ADDRESSES.has(destination) && KIT_SIGNATURES.has(receipt.input.slice(0, 10))
    );
  }

  async fromReceipt(block: Block, receipt: ExtendedTransactionReceipt): Promise<OrganisationCreatedEvent> {
    const signature = receipt.input.slice(0, 10);
    const abi = KIT_SIGNATURES.get(signature)!;
    const parameters = this.ethereum.codec.decodeParameters(abi, "0x" + receipt.input.slice(10));
    const ensName = `${parameters.name}.aragonid.eth`;
    const address = await this.ethereum.canonicalAddress(ensName);
    const timestamp = await block.timestamp();
    return this.fromJSON({
      platform: PLATFORM.ARAGON,
      name: ensName,
      address: address.toLowerCase(),
      txid: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber),
      blockHash: receipt.blockHash,
      timestamp: Number(timestamp)
    });
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
    const fromTransactions = await this.fromTransactions(block);
    const fromDeployInstanceEvent = await this.fromDeployInstanceEvent(block, DEPLOY_INSTANCE_EVENT);
    const factoryUsed = await this.fromDeployInstanceBunch(block);
    return fromTransactions.concat(fromDeployInstanceEvent).concat(factoryUsed);
  }
}
