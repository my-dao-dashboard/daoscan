import { Inject, Service } from "typedi";
import { EthereumService } from "../../services/ethereum.service";
import { PLATFORM } from "../../domain/platform";
import { Block } from "../block";
import { ConnectionFactory } from "../../storage/connection.factory";
import { logEvents } from "./events-from-logs";
import { BlockchainEvent } from "./blockchain-event";
import { APP_ID } from "../../storage/app-id";
import { TOKEN_CONTROLLER_ABI } from "./token-controller.abi";
import { AppInstalledEvent } from "../events/app-installed.event";

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

@Service(AppInstalledEventFactory.name)
export class AppInstalledEventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory
  ) {}

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

  async fromEvents(block: Block): Promise<AppInstalledEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    const nativeEvents = logEvents(this.ethereum.codec, extendedBlock, NEW_APP_PROXY_EVENT);
    const appInstalledPromised = nativeEvents.map<Promise<AppInstalledEvent>>(async e => {
      const organisationAddress = await this.kernelAddress(e.proxy);
      return new AppInstalledEvent({
        organisationAddress: organisationAddress.toLowerCase(),
        appId: e.appId,
        proxyAddress: e.proxy,
        platform: PLATFORM.ARAGON,
        blockNumber: e.blockNumber,
        blockHash: block.hash,
        timestamp: timestamp,
        txid: e.txid
      });
    });
    return Promise.all(appInstalledPromised);
  }

  async sharesEvents(native: AppInstalledEvent[]): Promise<AppInstalledEvent[]> {
    const tokenControllerEvents = native.filter(e => {
      return e.appId === APP_ID.ARAGON_TOKEN_CONTROLLER;
    });
    const promised = tokenControllerEvents.map<Promise<AppInstalledEvent>>(async e => {
      const tokenControllerAddress = e.proxyAddress;
      const tokenController = this.ethereum.contract(TOKEN_CONTROLLER_ABI, tokenControllerAddress);
      const tokenAddress = await tokenController.methods.token().call();
      return new AppInstalledEvent({
        platform: PLATFORM.ARAGON,
        organisationAddress: e.organisationAddress,
        appId: APP_ID.SHARE,
        proxyAddress: tokenAddress,
        txid: e.txid,
        blockHash: e.blockHash,
        blockNumber: e.blockNumber,
        timestamp: e.timestamp
      });
    });
    return Promise.all(promised);
  }

  async fromBlock(block: Block): Promise<AppInstalledEvent[]> {
    const nativeEvents = await this.fromEvents(block);
    const sharesEvent = await this.sharesEvents(nativeEvents);
    return nativeEvents.concat(sharesEvent);
  }
}
