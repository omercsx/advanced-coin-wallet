import { model, Schema, HydratedDocument } from "mongoose";

export interface IMigration {
  name: string;
  migration(): Promise<void>;
}

export interface IMigrationModel {
  name: string;
  executed: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

export const MigrationSchema = new Schema<IMigrationModel>(
  {
    name: { type: String, required: true },
    executed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const MigrationModel = model<IMigrationModel>("migrations", MigrationSchema);
export type IMigrationDocument = HydratedDocument<IMigrationModel>;
