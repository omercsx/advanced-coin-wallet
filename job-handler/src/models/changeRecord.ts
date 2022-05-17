import mongoose from "mongoose";
import { IChangeRecord } from "../interfaces/IChangeRecord";

const changeRecordSchema = new mongoose.Schema<IChangeRecord>(
  {
    eventDate: { type: Date, index: 1, required: true },
    value: { type: Number, index: 1, required: true },
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: "wallets", index: 1, required: true },
  },
  { timestamps: true }
);

changeRecordSchema.virtual("wallet", {
  ref: "wallets",
  localField: "walletId",
  foreignField: "_id",
  justOne: true,
});

changeRecordSchema.set("toObject", { virtuals: true });
changeRecordSchema.set("toJSON", { virtuals: true });

const ChangeRecordModel = mongoose.model<IChangeRecord>("changerecords", changeRecordSchema);

export default ChangeRecordModel;
