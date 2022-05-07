import mongoose from "mongoose";
import { IExchange } from "../interfaces/IExchange";

export enum CryptoExchange {
    Binance = "Binance",
    KuCoin = "KuCoin",
}

const exchangeSchema = new mongoose.Schema(
    {
        name: { type: String, enum: CryptoExchange, unique: true, required: true },
        baseApi: { type: String, index: 1, required: true },
        symbolListEndpoint: { type: String, index: 1, required: true },
        priceEndpoint: { type: String, index: 1, required: true },
        symbols: { type: [String], index: 1, default: [] },
        logoUrl: { type: String, index: 1, required: true }
    },
    { timestamps: true }
);

const Exchange = mongoose.model<IExchange>("exchanges", exchangeSchema);

export default Exchange;
