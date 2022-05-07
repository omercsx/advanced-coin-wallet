import { model, Schema, HydratedDocument } from "mongoose";

export interface IRecurringJob {
  schedule: string;
  lastRunAt?: Date;
  nextRunAt: Date;
  beingTriggered: boolean;
  beingTriggeredAt?: Date;
  enabled: boolean;
}

export const RecurringJobSchema = new Schema<IRecurringJob>(
  {
    schedule: { type: String, required: true }, // cron expression
    lastRunAt: { type: Date, index: true },
    nextRunAt: { type: Date, index: true, default: new Date() },
    beingTriggered: { type: Boolean, default: false, index: true },
    beingTriggeredAt: { type: Date, index: true, default: null },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RecurringJobModel = model<IRecurringJob>("recurringjobs", RecurringJobSchema);
export type IRecurringJobDocument = HydratedDocument<IRecurringJob>;
