import { Service } from "typedi";
import { CacheMap } from "../shared/cache-map";
import axios from "axios";

export function messariEndpoint(symbol: string) {
  return `https://data.messari.io/api/v1/assets/${symbol}/metrics`;
}

const EQUIVALENTS = Object.freeze(
  new Map<string, string>([["WETH", "ETH"]])
);

@Service(MessariService.name)
export class MessariService {
  private readonly cache = new CacheMap<string, number>(120 * 1000);

  messariSymbol(symbol: string) {
    const found = EQUIVALENTS.get(symbol);
    return found || symbol;
  }

  async usdPrice(symbol: string): Promise<number | undefined> {
    const cached = this.cache.get(symbol);
    if (cached) {
      return cached;
    } else {
      try {
        const endpoint = messariEndpoint(this.messariSymbol(symbol));
        const response = await axios.get(endpoint);
        const rawPrice = response.data?.data?.market_data?.price_usd;
        if (rawPrice) {
          const price = Number(rawPrice);
          this.cache.set(symbol, price);
          return price;
        } else {
          return undefined;
        }
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }
  }
}
