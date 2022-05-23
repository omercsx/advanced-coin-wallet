import mongoose, { Document } from "mongoose";
import { CryptoExchange } from "../models/exchange";

export interface IExchangeCryptoRecord extends Document {
  _id: mongoose.Types.ObjectId;
  lastCheckedDate: Date;
  value: number;
  cryptoSymbol: string;
  exchangeName: CryptoExchange;
}
