import mongoose, { Document } from "mongoose";
import { IUserCrypto } from "./IUserCrypto";
import { IUser } from "./IUser";

export enum TimePeriods {
  oneDay = "oneDay",
  threeDays = "threeDays",
  sevenDays = "sevenDays",
  oneMonth = "oneMonth",
}

export interface IDashboardResponseData {
  value: number;
  maxValue: number;
  minValue: number;
  eventDate: Date;
}

export interface IWallet extends Document {
  _id: mongoose.Types.ObjectId;
  cryptoIds: mongoose.Types.ObjectId[];
  cryptos: IUserCrypto[];
  recurringJobId: mongoose.Types.ObjectId;
  balance: number;
  updatedAt?: Date;
  createdAt?: Date;
}
