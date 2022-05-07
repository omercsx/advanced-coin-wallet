import mongoose, { Document } from "mongoose";
import { IExchange } from "./IExchange";
import { IWallet } from "./IWallet";

export interface IUserCrypto extends Document {
    _id: mongoose.Types.ObjectId;
    walletId: mongoose.Types.ObjectId;
    wallet: IWallet;
    exchangeId: mongoose.Types.ObjectId;
    exchange: IExchange;
    symbol: string;
    amount: number;
    firstPrice: number;
    lastPrice: number;
    updatedAt?: Date;
    createdat?: Date;
}