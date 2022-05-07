import mongoose, { Document } from "mongoose";
import { CryptoExchange } from "../models/exchange";

export interface IExchange extends Document {
    _id: mongoose.Types.ObjectId;
    name: CryptoExchange;
    baseApi: string;
    symbolListEndpoint: string;
    priceEndpoint: string;
    symbols: string[];
    logoUrl: string;
    updatedAt?: Date;
    createdat?: Date;
}