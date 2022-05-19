import Joi from "joi";
import { CryptoExchange } from "../models/exchange";

export const exchangeCreateValidator = Joi.object({
  name: Joi.string()
    .valid(...Object.values(CryptoExchange))
    .required(),
  baseApi: Joi.string().uri().required(),
  symbolListEndpoint: Joi.string().required(),
  priceEndpoint: Joi.string().required(),
  logoUrl: Joi.string().uri().required(),
});
