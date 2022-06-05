import mongoose, { Document } from "mongoose";
import { IWallet } from "./IWallet";

export enum UserRoles {
  user = "user",
  admin = "admin",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  walletId: mongoose.Types.ObjectId;
  wallet: IWallet;
  fullName: string;
  role: UserRoles;
  updatedAt?: Date;
  createdAt?: Date;
}
