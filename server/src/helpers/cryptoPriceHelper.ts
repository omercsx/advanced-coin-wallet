import axios from "axios";
import { CryptoExchange } from "../models/exchange";


export class CryptoPriceHelper {
    public static async getPrice(url: string, exchangeName: CryptoExchange): Promise<number> {
        const avgPriceResponse = await axios(url);
        let avgPrice: number;

        switch (exchangeName) {
            case CryptoExchange.Binance:
                avgPrice = +(avgPriceResponse.data.price);
                break;
            case CryptoExchange.KuCoin:
                avgPrice = +(avgPriceResponse.data.data.price);
        }

        console.log(url + " -> " + +(avgPrice.toFixed(4)));
        return +(avgPrice.toFixed(4));
    }
}