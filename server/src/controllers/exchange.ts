import { Request, Response } from "express";
import Exchange, { CryptoExchange } from "../models/exchange";
import axios from "axios";

import { SuccessResult, FailureResult } from "../models/result";
export class ExchangeController {

    public async Create(request: Request, response: Response) {
        try {
            const { name, baseApi, symbolListEndpoint, priceEndpoint, logoUrl } = request.body;

            const exchange = await Exchange.create({
                name,
                baseApi,
                symbolListEndpoint,
                priceEndpoint,
                logoUrl
            });

            return response.status(200).send(new SuccessResult("Exchange Created Successfully!", exchange));
        } catch (error: any) {
            if (error.isJoi) {
                return response.status(400).send(new FailureResult("Validation error: " + error.message));
            }

            console.log(error);
            return response.status(500).send(new FailureResult("Something went wrong."));
        }
    }

    public async RefreshSymbols(request: Request, response: Response) {
        try {
            const { name } = request.body;

            const exchange = await Exchange.findOne({ name });

            if (!exchange) {
                return response.status(404).send(new FailureResult("Exchange not found."));
            }

            const exchangeInfoResponse = await axios(exchange.baseApi + exchange.symbolListEndpoint);
            let symbolArray: string[] = [];

            switch (name) {
                case CryptoExchange.Binance:
                    for (const symbol of exchangeInfoResponse.data.symbols) {
                        if (symbol.symbol.endsWith("USDT")) {
                            symbolArray.push(symbol.symbol);
                        }
                    }
                    break;
                case CryptoExchange.KuCoin:
                    for (const symbolObject of exchangeInfoResponse.data.data) {
                        if (symbolObject.symbol.endsWith("USDT")) {
                            symbolArray.push(symbolObject.symbol);
                        }
                    }

                default:
                    break;
            }

            exchange.symbols = symbolArray;
            await exchange.save();

            return response.status(200).send(new SuccessResult("Exchange Refreshed Successfully!", exchange));
        } catch (error: any) {
            console.log(error);
            return response.status(500).send(new FailureResult("Something went wrong."));
        }
    }

    public async List(request: Request, response: Response) {
        try {
            const exchangeList = await Exchange.find();

            return response.status(200).send(new SuccessResult("Exchange List Fetched Successfully!", exchangeList));
        } catch (error) {
            console.log(error);
            return response.status(500).send(new FailureResult("Something went wrong."));
        }
    }

    public async GetOne(request: Request, response: Response) {
        try {
            const { exchangeId } = request.params;

            const exchange = await Exchange.findById(exchangeId);

            return response.status(200).send(new SuccessResult("Exchange Fetched Successfully!", exchange));
        } catch (error) {
            console.log(error);
            return response.status(500).send(new FailureResult("Something went wrong."));
        }
    }
}
