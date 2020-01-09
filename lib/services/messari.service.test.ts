import axios from "axios";
import { MessariService } from "./messari.service";

jest.mock("axios");

beforeEach(() => {
  (axios.get as any).mockReset();
});

test("fetch data from messari", async () => {
  (axios.get as any).mockImplementationOnce(() => {
    return {
      data: {
        data: {
          market_data: {
            price_usd: "12"
          }
        }
      }
    };
  });
  const service = new MessariService();
  const price = await service.usdPrice("ETH");
  expect(price).toEqual(12);
  expect(axios.get).toBeCalled();
});

test("return 0 if invalid data", async () => {
  (axios.get as any).mockImplementationOnce(() => {
    return {
      data: null
    };
  });
  const service = new MessariService();
  const price = await service.usdPrice("ETH");
  expect(price).toEqual(0);
  expect(axios.get).toBeCalled();
});

test("return 0 if error", async () => {
  (axios.get as any).mockImplementationOnce(() => {
    throw new Error("oops");
  });
  const service = new MessariService();
  const price = await service.usdPrice("ETH");
  expect(price).toEqual(0);
  expect(axios.get).toBeCalled();
});

test("cache values", async () => {
  (axios.get as any).mockImplementationOnce(() => {
    return {
      data: {
        data: {
          market_data: {
            price_usd: "12"
          }
        }
      }
    };
  });
  const service = new MessariService();
  const price = await service.usdPrice("ETH");
  expect(price).toEqual(12);
  expect(axios.get).toBeCalled();
  const secondCall = await service.usdPrice("ETH");
  expect(secondCall).toEqual(12);
  const thirdCall = await service.usdPrice("ETH");
  expect(thirdCall).toEqual(12);
  expect(axios.get).toBeCalledTimes(1);
});
