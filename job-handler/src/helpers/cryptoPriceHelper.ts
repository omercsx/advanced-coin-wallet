import axios from "axios";
import { CryptoExchange } from "../models/exchange";
import ExchangeCryptoRecordModel from "../models/exchangeCryptoRecord";

export class CryptoPriceHelper {
  public static async getPriceFromApi(url: string, exchangeName: CryptoExchange): Promise<number> {
    const avgPriceResponse = await axios(url);
    let avgPrice: number;

    switch (exchangeName) {
      case CryptoExchange.Binance:
        avgPrice = +avgPriceResponse.data.price;
        break;
      case CryptoExchange.KuCoin:
        avgPrice = +avgPriceResponse.data.data.price;
    }

    console.log(url + " -> " + +avgPrice.toFixed(4));
    return +avgPrice.toFixed(4);
  }

  public static async getPrice(url: string, exchangeName: CryptoExchange, cryptoSymbol: string): Promise<number> {
    const now = new Date();
    const oneMinuteBefore = new Date(now.getTime() - 60 * 1000);

    const exchangeCryptoRecord = await ExchangeCryptoRecordModel.findOne({
      exchangeName: exchangeName,
      cryptoSymbol: cryptoSymbol,
    });

    if (!exchangeCryptoRecord) {
      const value = await CryptoPriceHelper.getPriceFromApi(url, exchangeName);

      await ExchangeCryptoRecordModel.create({
        lastCheckedDate: now,
        value: value,
        exchangeName: exchangeName,
        cryptoSymbol: cryptoSymbol,
      });
      return value;
    }

    if (exchangeCryptoRecord.lastCheckedDate.getTime() >= oneMinuteBefore.getTime()) {
      const value = await CryptoPriceHelper.getPriceFromApi(url, exchangeName);

      exchangeCryptoRecord.lastCheckedDate = now;
      exchangeCryptoRecord.value = value;
      await exchangeCryptoRecord.save();
      return value;
    }

    return exchangeCryptoRecord.value;
  }
}
