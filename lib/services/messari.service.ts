import { Service } from "typedi";
import { CacheMap } from "../shared/cache-map";
import axios from "axios";

@Service()
export class MessariService {
  private readonly cache = new CacheMap<string, number>(120 * 1000);

  async usdPrice(symbol: string): Promise<number> {
    const cached = this.cache.get(symbol);
    if (cached) {
      return cached;
    } else {
      try {
        const endpoint = `https://data.messari.io/api/v1/assets/${symbol}/metrics`;
        const response = await axios.get(endpoint);
        const price = response.data.data.market_data.price_usd as number;
        this.cache.set(symbol, price);
        return price;
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
  }
}
