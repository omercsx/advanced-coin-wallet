import axios from "axios";
import { Request, Response } from "express";
import UserCrypto from "../models/userCrypto";

import { SuccessResult, FailureResult } from "../models/result";
import Wallet from "../models/wallet";
import Exchange, { CryptoExchange } from "../models/exchange";
import { CryptoPriceHelper } from "../helpers/cryptoPriceHelper";

export class UserCryptoController {
    public static async Add(request: Request, response: Response) {
        try {
            const { exchangeName, symbol, amount } = request.body;

            const userWallet = await Wallet.findById(response.locals.user.walletId);

            if (!userWallet) {
                return response.status(404).send(new FailureResult("User Wallet not found"));
            }

            const exchange = await Exchange.findOne({ name: exchangeName });

            if (!exchange) {
                return response.status(404).send(new FailureResult("Exchange not found"));
            }

            if (!exchange.symbols.includes(symbol)) {
                return response.status(400).send(new FailureResult(symbol + " does not exist on " + exchange.name));
            }

            const avgPrice = await CryptoPriceHelper.getPrice(exchange.baseApi + exchange.priceEndpoint + symbol, exchange.name);

            const newUserCrypto = await UserCrypto.create({
                walletId: userWallet.id,
                exchangeId: exchange._id,
                symbol,
                firstPrice: avgPrice,
                lastPrice: avgPrice,
                amount
            });

            userWallet.cryptoIds.push(newUserCrypto.id);
            userWallet.balance += +((avgPrice * amount).toFixed(4));
            userWallet.balance = +(userWallet.balance.toFixed(4));
            await userWallet.save();

            newUserCrypto.exchange = exchange;
            return response.status(200).send(new SuccessResult("Crypto added successfully", { newUserCrypto: newUserCrypto, balance: userWallet.balance }));
        } catch (error: any) {
            if (error.isJoi) {
                return response.status(400).send(new FailureResult("Validation error: " + error.message));
            }

            console.log(error);
            return response.status(500).send(new FailureResult("Something went wrong."));
        }
    }

    public static async Update(request: Request, response: Response) {
        try {
            const { newAmount } = request.body;
            const { userCryptoId } = request.params;

            const userCrypto = await UserCrypto
                .findById(userCryptoId)
                .populate("exchange", "name baseApi priceEndpoint");

            if (!userCrypto) {
                return response.status(404).send(new FailureResult("Specified user crypto not found!"));
            }

            const wallet = await Wallet.findById(userCrypto.walletId);

            if (!wallet) {
                return response.status(404).send(new FailureResult("Wallet not found!"));
            }

            if (response.locals.user.walletId.toString() !== wallet._id.toString()) {
                return response.status(403).send(new FailureResult("You cannot do that!"));
            }

            wallet.balance -= +((userCrypto.lastPrice * userCrypto.amount).toFixed(4));
            wallet.balance = +(wallet.balance.toFixed(4));
            const avgPrice = await CryptoPriceHelper.getPrice(userCrypto.exchange.baseApi + userCrypto.exchange.priceEndpoint + userCrypto.symbol, userCrypto.exchange.name);

            userCrypto.lastPrice = avgPrice;
            wallet.balance += +((avgPrice * newAmount).toFixed(4));
            wallet.balance = +(wallet.balance.toFixed(4));
            await wallet.save();

            userCrypto.amount = newAmount;
            await userCrypto.save();

            return response.status(200).send(new SuccessResult("Crypto Updated Successfully!", userCrypto));
        } catch (error) {
            console.log(error);
            return response.status(500).json(new FailureResult("Something went wrong."));
        }
    }

    public static async Delete(request: Request, response: Response) {
        try {
            const { userCryptoId } = request.params;

            const userCrypto = await UserCrypto.findById(userCryptoId);

            if (!userCrypto) {
                return response.status(404).send(new FailureResult("Specified user crypto not found!"));
            }

            const wallet = await Wallet.findById(userCrypto.walletId);

            if (!wallet) {
                return response.status(404).send(new FailureResult("Wallet not found!"));
            }

            if (response.locals.user.walletId.toString() !== wallet._id.toString()) {
                return response.status(403).send(new FailureResult("You cannot do that!"));
            }

            wallet.balance -= +((userCrypto.lastPrice * userCrypto.amount).toFixed(4));
            wallet.balance = +(wallet.balance.toFixed(4));
            wallet.cryptoIds = wallet.cryptoIds.filter(cryptoId => cryptoId.toString() !== userCrypto.id);

            await wallet.save();

            await userCrypto.deleteOne();

            return response.status(204).send();
        } catch (error) {
            console.log(error);
            return response.status(500).json(new FailureResult("Something went wrong."));
        }
    }
}
