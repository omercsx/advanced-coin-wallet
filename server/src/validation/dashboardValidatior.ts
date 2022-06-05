import Joi from "joi";
import { TimePeriods } from "../interfaces/IWallet";

export const dashboardValidator = Joi.object({
  timePeriod: Joi.string()
    .valid(...Object.values(TimePeriods))
    .required(),
});
