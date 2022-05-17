import mongoose, { Document } from "mongoose";
import { CryptoExchange } from "../models/exchange";
import { IWallet } from "./IWallet";

export interface IChangeRecord extends Document {
  _id: mongoose.Types.ObjectId;
  eventDate: Date;
  value: number;
  walletId: mongoose.Types.ObjectId;
  wallet: IWallet;
  createdAt?: Date;
  updatedAt?: Date;
}
