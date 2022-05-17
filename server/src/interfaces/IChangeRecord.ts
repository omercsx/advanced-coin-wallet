import mongoose, { Document } from "mongoose";
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
