import mongoose, { Document } from "mongoose";
import { IUserCrypto } from "./IUserCrypto";
import { IUser } from "./IUser";

export interface IWallet extends Document {
    _id: mongoose.Types.ObjectId;
    cryptoIds: mongoose.Types.ObjectId[];
    cryptos: IUserCrypto[];
    balance: number;
    updatedAt?: Date;
    createdat?: Date;
}