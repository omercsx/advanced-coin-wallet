import Joi from "joi";
import { CryptoExchange } from "../models/exchange";

export const userCryptoCreateValidator = Joi.object({
  exchangeName: Joi.string()
    .valid(...Object.values(CryptoExchange))
    .required(),
  symbol: Joi.string().required(),
  amount: Joi.number().required(),
});

export const userCryptoUpdateValidator = Joi.object({
  userCryptoId: Joi.string().required(),
  newAmount: Joi.number().required(),
});
