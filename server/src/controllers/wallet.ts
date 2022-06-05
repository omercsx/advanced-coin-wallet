import { Request, Response } from "express";
import { CryptoPriceHelper } from "../helpers/cryptoPriceHelper";
import { IDashboardResponseData, TimePeriods } from "../interfaces/IWallet";
import ChangeRecordModel from "../models/changeRecord";

import { SuccessResult, FailureResult } from "../models/result";
import UserCrypto from "../models/userCrypto";
import Wallet from "../models/wallet";
import { dashboardValidator } from "../validation/dashboardValidatior";

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
    const timePeriod: TimePeriods = request.query.timePeriod as TimePeriods;

    try {
      await dashboardValidator.validateAsync({ timePeriod });

      const fromDate = calculateFromDate(timePeriod);
      let responseData: IDashboardResponseData[] = [];

      const lastChanges = await ChangeRecordModel.aggregate([
        {
          $match: {
            walletId: response.locals.user.walletId,
            eventDate: { $gte: fromDate },
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

      let index = 0;

      switch (timePeriod) {
        case TimePeriods.oneDay:
          responseData = lastChanges;
          break;
        case TimePeriods.threeDays:
          index = 0;
          responseData = (lastChanges as IDashboardResponseData[]).reduce((acc, curr) => {
            if (index % 2 === 0) {
              acc.push(curr);
            } else {
              acc[acc.length - 1].value = (acc[acc.length - 1].value + curr.value) / 2;
              acc[acc.length - 1].maxValue = Math.max(acc[acc.length - 1].maxValue, curr.maxValue);
              acc[acc.length - 1].minValue = Math.min(acc[acc.length - 1].minValue, curr.minValue);
            }
            index++;
            return acc;
          }, [] as IDashboardResponseData[]);
          break;
        case TimePeriods.sevenDays:
          index = 0;
          responseData = (lastChanges as IDashboardResponseData[]).reduce((acc, curr) => {
            if (index % 4 === 0) {
              acc.push(curr);
            } else {
              acc[acc.length - 1].value = (acc[acc.length - 1].value + curr.value) / 2;
              acc[acc.length - 1].maxValue = Math.max(acc[acc.length - 1].maxValue, curr.maxValue);
              acc[acc.length - 1].minValue = Math.min(acc[acc.length - 1].minValue, curr.minValue);
            }
            index++;
            return acc;
          }, [] as IDashboardResponseData[]);
          break;
        case TimePeriods.oneMonth:
          index = 0;
          // group lastChanges by every 4 elements
          responseData = (lastChanges as IDashboardResponseData[]).reduce((acc, curr) => {
            if (index % 12 === 0) {
              acc.push(curr);
            } else {
              acc[acc.length - 1].value = (acc[acc.length - 1].value + curr.value) / 2;
              acc[acc.length - 1].maxValue = Math.max(acc[acc.length - 1].maxValue, curr.maxValue);
              acc[acc.length - 1].minValue = Math.min(acc[acc.length - 1].minValue, curr.minValue);
            }
            index++;
            return acc;
          }, [] as IDashboardResponseData[]);
          break;
      }

      return response.status(200).send(new SuccessResult("Dashboard Fetched Successfully!", responseData));
    } catch (error: any) {
      if (error.isJoi) {
        return response.status(400).send(new FailureResult("Validation error: " + error.message));
      }

      console.log(error);
      return response.status(500).json(new FailureResult("Something went wrong."));
    }
  }
}

function calculateFromDate(timePeriod: TimePeriods) {
  const now = new Date();

  switch (timePeriod) {
    case TimePeriods.oneDay:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case TimePeriods.threeDays:
      return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    case TimePeriods.sevenDays:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case TimePeriods.oneMonth:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}
