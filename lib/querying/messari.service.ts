import { Service } from "typedi";
import { CacheMap } from "../shared/cache-map";
import axios from "axios";

export function messariEndpoint(symbol: string) {
  return `https://data.messari.io/api/v1/assets/${symbol}/metrics`;
}

@Service(MessariService.name)
export class MessariService {
  private readonly cache = new CacheMap<string, number>(120 * 1000);

  async usdPrice(symbol: string): Promise<number> {
    const cached = this.cache.get(symbol);
    if (cached) {
      return cached;
    } else {
      try {
        const endpoint = messariEndpoint(symbol);
        const response = await axios.get(endpoint);
        const rawPrice = response.data?.data?.market_data?.price_usd;
        if (rawPrice) {
          const price = Number(rawPrice);
          this.cache.set(symbol, price);
          return price;
        } else {
          return 0;
        }
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
  }
}
