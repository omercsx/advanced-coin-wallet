import mongoose, { Document } from "mongoose";
import { IUserCrypto } from "./IUserCrypto";
import { IUser } from "./IUser";

export interface IWallet extends Document {
  _id: mongoose.Types.ObjectId;
  cryptoIds: mongoose.Types.ObjectId[];
  cryptos: IUserCrypto[];
  recurringJobId: mongoose.Types.ObjectId;
  balance: number;
  updatedAt?: Date;
  createdAt?: Date;
}
