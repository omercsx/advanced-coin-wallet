import mongoose, { Document } from "mongoose";
import { IWallet } from "./IWallet";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  walletId: mongoose.Types.ObjectId;
  wallet: IWallet;
  updatedAt?: Date;
  createdat?: Date;
}