import { AbiInput, AbiItem } from "web3-utils";
import { BlockchainEvent } from "./blockchain-event.interface";

export interface NewAppProxyParams {
  proxy: string;
  isUpgradeable: boolean;
  appId: string;
}

// New application installed
// NewAppProxy(address proxy, bool isUpgradeable, bytes32 appId)
export const NEW_APP_PROXY_EVENT: BlockchainEvent<NewAppProxyParams> = {
  signature: "0xd880e726dced8808d727f02dd0e6fdd3a945b24bfee77e13367bcbe61ddbaf47",
  abi: [
    {
      type: "address",
      name: "proxy"
    },
    {
      type: "bool",
      name: "isUpgradeable"
    },
    {
      type: "bytes32",
      name: "appId"
    }
  ]
};

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

export interface DeployInstanceParams {
  dao: string;
}

export const DEPLOY_INSTANCE_EVENT: BlockchainEvent<DeployInstanceParams> = {
  signature: "0x8f42a14c9fe9e09f4fe8eeee69ae878731c838b6497425d4c30e1d09336cf34b",
  abi: [
    { indexed: false, name: "dao", type: "address" }
  ]
};


export const KIT_ADDRESSES = new Set(
  [
    // Democracy 1 (0.6)
    "0x705Cd9a00b87Bb019a87beEB9a50334219aC4444",

    // Multisig 1 (0.6)
    "0x41bbaf498226b68415f1C78ED541c45A18fd7696",

    // Democracy 2 (0.7)
    "0x7f3ed10366826a1227025445D4f4e3e14BBfc91d",

    // Multisig 2 (0.7)
    "0x87aa2980dde7d2D4e57191f16BB57cF80bf6E5A6",

    // Company Board (0.8)
    "0x4d1A892f42c947fa952b57bc6939b27A96215CfA",

    // Company (0.8)
    "0xd737632caC4d039C9B0EEcc94C12267407a271b5",

    // Membership (0.8)
    "0x67430642C0c3B5E6538049B9E9eE719f2a4BeE7c",

    // Reputation (0.8)
    "0x3a06A6544e48708142508D9042f94DDdA769d04F",

    // Open Enterprise (0.8.4)
    "0xc54c5dB63aB0E79FBb9555373B969093dEb17859"
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

export const TOKEN_CONTROLLER_ABI: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "hasInitialized",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "MAX_VESTINGS_PER_ADDRESS",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_holder", type: "address" }],
    name: "spendableBalanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_receiver", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_start", type: "uint64" },
      { name: "_cliff", type: "uint64" },
      { name: "_vested", type: "uint64" },
      { name: "_revokable", type: "bool" }
    ],
    name: "assignVested",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_script", type: "bytes" }],
    name: "getEVMScriptExecutor",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getRecoveryVault",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_recipient", type: "address" },
      { name: "_vestingId", type: "uint256" }
    ],
    name: "getVesting",
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "start", type: "uint64" },
      { name: "cliff", type: "uint64" },
      { name: "vesting", type: "uint64" },
      { name: "revokable", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_receiver", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "onTransfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_holder", type: "address" },
      { name: "_time", type: "uint256" }
    ],
    name: "transferableBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_token", type: "address" }],
    name: "allowRecoverability",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "appId",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "ISSUE_ROLE",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getInitializationBlock",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "vestingsLengths",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_token", type: "address" }],
    name: "transferToVault",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_holder", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sender", type: "address" },
      { name: "_role", type: "bytes32" },
      { name: "_params", type: "uint256[]" }
    ],
    name: "canPerform",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getEVMScriptRegistry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "ASSIGN_ROLE",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BURN_ROLE",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_receiver", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "assign",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sender", type: "address" },
      { name: "", type: "bytes" }
    ],
    name: "canForward",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "issue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "kernel",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_evmScript", type: "bytes" }],
    name: "forward",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
      { name: "", type: "uint256" }
    ],
    name: "onApprove",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isPetrified",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_transferable", type: "bool" },
      { name: "_maxAccountTokens", type: "uint256" }
    ],
    name: "initialize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "MINT_ROLE",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "maxAccountTokens",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "REVOKE_VESTINGS_ROLE",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "", type: "address" }],
    name: "proxyPayment",
    outputs: [{ name: "", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_holder", type: "address" },
      { name: "_vestingId", type: "uint256" }
    ],
    name: "revokeVesting",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "token",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isForwarder",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "receiver", type: "address" },
      { indexed: false, name: "vestingId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" }
    ],
    name: "NewVesting",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "receiver", type: "address" },
      { indexed: false, name: "vestingId", type: "uint256" },
      { indexed: false, name: "nonVestedAmount", type: "uint256" }
    ],
    name: "RevokeVesting",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "executor", type: "address" },
      { indexed: false, name: "script", type: "bytes" },
      { indexed: false, name: "input", type: "bytes" },
      { indexed: false, name: "returnData", type: "bytes" }
    ],
    name: "ScriptResult",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "vault", type: "address" },
      { indexed: true, name: "token", type: "address" },
      { indexed: false, name: "amount", type: "uint256" }
    ],
    name: "RecoverToVault",
    type: "event"
  }
];

export const TOKEN_ABI: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "creationBlock",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newController", type: "address" }],
    name: "changeController",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_blockNumber", type: "uint256" }
    ],
    name: "balanceOfAt",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_cloneTokenName", type: "string" },
      { name: "_cloneDecimalUnits", type: "uint8" },
      { name: "_cloneTokenSymbol", type: "string" },
      { name: "_snapshotBlock", type: "uint256" },
      { name: "_transfersEnabled", type: "bool" }
    ],
    name: "createCloneToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "parentToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "generateTokens",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_blockNumber", type: "uint256" }],
    name: "totalSupplyAt",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "transfersEnabled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "parentSnapShotBlock",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_extraData", type: "bytes" }
    ],
    name: "approveAndCall",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "destroyTokens",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_token", type: "address" }],
    name: "claimTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "tokenFactory",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_transfersEnabled", type: "bool" }],
    name: "enableTransfers",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "controller",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "_tokenFactory", type: "address" },
      { name: "_parentToken", type: "address" },
      { name: "_parentSnapShotBlock", type: "uint256" },
      { name: "_tokenName", type: "string" },
      { name: "_decimalUnits", type: "uint8" },
      { name: "_tokenSymbol", type: "string" },
      { name: "_transfersEnabled", type: "bool" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_token", type: "address" },
      { indexed: true, name: "_controller", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" }
    ],
    name: "ClaimedTokens",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_from", type: "address" },
      { indexed: true, name: "_to", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_cloneToken", type: "address" },
      { indexed: false, name: "_snapshotBlock", type: "uint256" }
    ],
    name: "NewCloneToken",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_owner", type: "address" },
      { indexed: true, name: "_spender", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  }
];
