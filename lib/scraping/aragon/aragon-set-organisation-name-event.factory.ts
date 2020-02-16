import { Inject, Service } from "typedi";
import { Block } from "../block";
import { AbiInput } from "web3-utils";
import { EthereumService, ExtendedTransactionReceipt } from "../../services/ethereum.service";
import { PLATFORM } from "../../domain/platform";
import { SetOrganisationNameEvent, SetOrganisationNameEventProps } from "../events/set-organisation-name.event";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { ConnectionFactory } from "../../storage/connection.factory";
import { HistoryRepository } from "../../storage/history.repository";
import { EventRepository } from "../../storage/event.repository";

const KIT_ADDRESSES = new Set(
  [
    "0xd4bc1aFD46e744F1834cad01B2262d095DCB6C9B", // Fundraising (0.8.7),
    "0x67430642C0c3B5E6538049B9E9eE719f2a4BeE7c", // Membership (0.8),
    "0x3a06A6544e48708142508D9042f94DDdA769d04F" // Reputation (0.8)
  ].map(a => a.toLowerCase())
);

const KIT_SIGNATURES = new Map<string, AbiInput[]>([
  // Fundraising (0.8.7)
  [
    "0x350cbe71",
    [
      {
        name: "name",
        type: "string"
      },
      {
        name: "virtualSupplies",
        type: "uint256[2]"
      },
      {
        name: "_virtualBalances",
        type: "uint256[2]"
      },
      {
        name: "_slippages",
        type: "uint256[2]"
      },
      {
        name: "_rateDAI",
        type: "uint256"
      },
      {
        name: "_floorDAI",
        type: "uint256"
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
  ]
]);

@Service(AragonSetOrganisationNameEventFactory.name)
export class AragonSetOrganisationNameEventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(HistoryRepository.name) private readonly historyRepository: HistoryRepository,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository
  ) {}

  isSuitableReceipt(receipt: ExtendedTransactionReceipt): boolean {
    const destination = receipt.to?.toLowerCase();
    const status = receipt.status;
    return (
      status && Boolean(destination) && KIT_ADDRESSES.has(destination) && KIT_SIGNATURES.has(receipt.input.slice(0, 10))
    );
  }

  async fromReceipt(block: Block, receipt: ExtendedTransactionReceipt): Promise<SetOrganisationNameEvent> {
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

  fromJSON(json: SetOrganisationNameEventProps) {
    return new SetOrganisationNameEvent(
      json,
      this.organisationRepository,
      this.connectionFactory,
      this.historyRepository,
      this.eventRepository
    );
  }

  async fromBlock(block: Block): Promise<SetOrganisationNameEvent[]> {
    const receipts = await block.receipts();
    const suitableReceipts = receipts.filter(r => this.isSuitableReceipt(r));
    return Promise.all(
      suitableReceipts.map(async receipt => {
        return await this.fromReceipt(block, receipt);
      })
    );
  }
}
