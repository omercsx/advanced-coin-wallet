import mongoose from "mongoose";
import { IWallet } from "../interfaces/IWallet";

const walletSchema = new mongoose.Schema(
  {
    cryptoIds: { type: [mongoose.Schema.Types.ObjectId], index: 1, required: false },
    balance: { type: Number, index: 1, default: 0 },
    recurringJobId: { type: mongoose.Schema.Types.ObjectId, ref: "recurringjobs", required: false },
  },
  { timestamps: true }
);

walletSchema.virtual("cryptos", {
  ref: "usercryptos",
  localField: "cryptoIds",
  foreignField: "_id",
  justOne: false,
});

walletSchema.set("toObject", { virtuals: true });
walletSchema.set("toJSON", { virtuals: true });

const Wallet = mongoose.model<IWallet>("wallets", walletSchema);

export default Wallet;
