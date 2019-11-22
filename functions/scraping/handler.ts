import { EthereumService } from "../../lib/ethereum.service";
import { BlockParsing } from "../../lib/block-parsing";
import { KIT_ADDRESSES, KIT_SIGNATURES, NEW_APP_PROXY_EVENT } from "../../lib/aragon.constants";

const infuraProjectId = String(process.env.INFURA_PROJECT_ID);
const ethereum = new EthereumService(infuraProjectId);
const parsing = new BlockParsing(ethereum.web3);

export async function block(event: any) {
  const blockNumber = Number(event.pathParameters.id);

  const block = await ethereum.extendedBlock(blockNumber);
  const events = await parsing.events(block, NEW_APP_PROXY_EVENT);
  const parsed = parsing.transactions(block, KIT_ADDRESSES, KIT_SIGNATURES);

  return {
    statusCode: 200,
    body: JSON.stringify({
      block,
      events,
      parsed
    })
  };
}
