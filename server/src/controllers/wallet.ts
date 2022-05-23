import { Request, Response } from "express";
import { CryptoPriceHelper } from "../helpers/cryptoPriceHelper";
import ChangeRecordModel from "../models/changeRecord";

import { SuccessResult, FailureResult } from "../models/result";
import UserCrypto from "../models/userCrypto";
import Wallet from "../models/wallet";

export class WalletController {
  public async Get(request: Request, response: Response) {
    try {
      const wallet = await Wallet.findById(response.locals.user.walletId).populate([
        {
          path: "cryptos",
          populate: {
            path: "exchange",
            select: "-symbols -createdAt -updatedAt",
          },
        },
      ]);

      if (!wallet) {
        return response.status(404).send(new FailureResult("User wallet not found!"));
      }

      return response.status(200).send(new SuccessResult("Wallet Fetched Successfully!", wallet));
    } catch (error) {
      console.log(error);
      return response.status(500).json(new FailureResult("Something went wrong."));
    }
  }

  public async Dashboard(request: Request, response: Response) {
    try {
      const lastChanges = await ChangeRecordModel.aggregate([
        {
          $match: {
            walletId: response.locals.user.walletId,
            eventDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) },
          },
        },
        {
          $project: {
            eventDate: {
              $dateToString: { date: "$eventDate", format: "%Y-%m-%d-%H" },
            },
            value: 1,
          },
        },
        {
          $group: {
            _id: { eventDate: "$eventDate" },
            value: { $avg: "$value" },
            maxValue: { $max: "$value" },
            minValue: { $min: "$value" },
          },
        },
        {
          $project: {
            _id: 0,
            value: 1,
            maxValue: 1,
            minValue: 1,
            eventDate: {
              $dateFromString: {
                dateString: "$_id.eventDate",
                format: "%Y-%m-%d-%H",
              },
            },
          },
        },
        {
          $sort: { eventDate: 1 },
        },
      ]);

      return response.status(200).send(new SuccessResult("Dashboard Fetched Successfully!", lastChanges));
    } catch (error) {
      console.log(error);
      return response.status(500).json(new FailureResult("Something went wrong."));
    }
  }
}
