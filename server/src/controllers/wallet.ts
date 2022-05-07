import { Request, Response } from "express";
import { CryptoPriceHelper } from "../helpers/cryptoPriceHelper";

import { SuccessResult, FailureResult } from "../models/result";
import UserCrypto from "../models/userCrypto";
import Wallet from "../models/wallet";

export class WalletController {
    public async Get(request: Request, response: Response) {
        try {
            const wallet = await Wallet.findById(response.locals.user.walletId);

            if (!wallet) {
                return response.status(404).send(new FailureResult("User wallet not found!"));
            }

            const userCryptos = await UserCrypto.find({ walletId: wallet.id }).populate({
                path: "exchange",
                select: "-symbols -createdAt -updatedAt"
            });

            wallet.balance = 0;
            for (const userCrypto of userCryptos) {
                const currentPrice = await CryptoPriceHelper.getPrice(userCrypto.exchange.baseApi + userCrypto.exchange.priceEndpoint + userCrypto.symbol, userCrypto.exchange.name);

                wallet.balance += +((currentPrice * userCrypto.amount).toFixed(4));
                wallet.balance = +(wallet.balance.toFixed(4));
                userCrypto.lastPrice = currentPrice;
                userCrypto.save();
            }

            await wallet.save();
            wallet.cryptos = userCryptos;

            return response.status(200).send(new SuccessResult("Wallet Fetched Successfully!", wallet));
        } catch (error) {
            console.log(error);
            return response.status(500).json(new FailureResult("Something went wrong."));
        }
    }
}
