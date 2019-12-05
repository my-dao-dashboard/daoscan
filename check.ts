import {Log} from "web3-core";

const Web3 = require("web3");

const infura = "https://mainnet.infura.io/v3/7e19ece913ca433cadb164942a0b3e2e";

// KERNEL: 0xb788256177F8398babdDb1118bc4aa0557Ed8c65
// Tokens App AKA Tokens Controller: 0x189445c662f5c74ed8da964dc0e56a9657d8e16f
// Vault: 0xf78d15eee67341ad81a6f843d49e7921c41f4715
// Token: 0xff2b202d1d7ce83e62dc19b6b7d23ed9378e8f29

const web3 = new Web3(new Web3.providers.HttpProvider(infura));

const TOKEN_CONTROLLER_ADDRESS = "0xB06e27d502D6A43D3Fbf1e9587FA95563F8ceFf2";

const TOKEN_CONTROLLER_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const TOKEN_ABI = [
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

const tokenContract = new web3.eth.Contract(TOKEN_CONTROLLER_ABI, TOKEN_CONTROLLER_ADDRESS);

async function main() {
  console.log(await tokenContract.methods.token().call())
  // const events = await tokenContract.getPastEvents()
  // const balance = await tokenContract.methods.balanceOf('0xBAc675C310721717Cd4A37F6cbeA1F081b1C2a07').call()
  // const balance = await tokenContract.methods.totalSupply().call()
  // console.log(balance)
  // console.log(events)
  // console.log(events)
  // const receipt = await web3.eth.getTransactionReceipt('0x9e9652504320aceef93a0db5274b873c1ab2bc25a88a928e3caa00d6f6ebaa56')
  // const signature = '0xd880e726dced8808d727f02dd0e6fdd3a945b24bfee77e13367bcbe61ddbaf47'
  // const abi = [{
  //   type: 'address',
  //   name: 'proxy'
  // }, {
  //   type: 'bool',
  //   name: 'isUpgradeable'
  // }, {
  //   type: 'bytes32',
  //   name: 'appId'
  // }]
  // const ee = receipt.logs.filter((log: Log) => log.topics[0] === signature).map((log: Log) => {
  //   return {
  //     ...(web3.eth.abi.decodeLog(abi, log.data, log.topics)),
  //     txid: log.transactionHash,
  //     blockNumber: log.blockNumber
  //   };
  // })
  // console.log(receipt.logs)
  // receipts.forEach(r => {
  //   console.log(r)
  // })
}

main();
