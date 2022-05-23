import mongoose from "mongoose";
import { IExchangeCryptoRecord } from "../interfaces/IExchangeCryptoRecord";

const exchangeCryptoRecordSchema = new mongoose.Schema<IExchangeCryptoRecord>({
  lastCheckedDate: { type: Date, index: 1, required: true },
  value: { type: Number, index: 1, required: true },
  exchangeName: { type: String, index: 1, required: true },
  cryptoSymbol: { type: String, index: 1, required: true },
});

const ExchangeCryptoRecordModel = mongoose.model<IExchangeCryptoRecord>(
  "exchangecryptorecords",
  exchangeCryptoRecordSchema
);

export default ExchangeCryptoRecordModel;
