import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Request, Response } from "express";

import User from "../models/user";
import { SuccessResult, FailureResult } from "../models/result";
import { userLoginValidator, userRegisterValidator } from "../validation/userValidator";
import { IUser } from "../interfaces/IUser";
import Wallet from "../models/wallet";
import { RecurringJobModel } from "../models/recurringJob";

export class AuthController {
  public async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      await userLoginValidator.validateAsync({ email, password });

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return response.status(401).json(new FailureResult("User not found"));
      }

      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordCorrect) {
        return response.status(401).json(new FailureResult("Invalid credentials"));
      }

      request.session.userId = existingUser._id.toString();

      return response
        .status(200)
        .json(new SuccessResult("Login successful", { email: existingUser.email, fullName: existingUser.fullName }));
    } catch (error: any) {
      if (error.isJoi) {
        return response.status(400).send(new FailureResult("Validation error: " + error.message));
      }

      console.log(error);
      return response.status(500).json(new FailureResult("Something went wrong."));
    }
  }

  public async register(request: Request, response: Response) {
    try {
      const { email, password, fullName } = request.body;

      await userRegisterValidator.validateAsync({ email, password, fullName });

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return response.status(400).send(new FailureResult("A user with this email already exists. Try signing in."));
      }

      const userWallet = await Wallet.create({ balance: 0 });

      const second = Math.round(Math.random() * 59);
      const minute = Math.round(Math.random() * 4);
      const cronJob = await RecurringJobModel.create({
        schedule: `${second} ${minute}/5 * * * *`,
        beingTriggered: false,
        enabled: false,
      });

      userWallet.recurringJobId = cronJob._id;
      await userWallet.save();

      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await new User({
        email,
        password: hashedPassword,
        walletId: userWallet.id,
        fullName,
      }).save();

      if (result != null) {
        return response.status(201).send(new SuccessResult("Registered successfully", null));
      }

      return response.status(500).send(new SuccessResult("Registeration failed", null));
    } catch (error: any) {
      if (error.isJoi) {
        return response.status(400).send(new FailureResult("Validation error: " + error.message));
      }

      console.log(error);
      return response.status(500).send(new FailureResult("Something went wrong."));
    }
  }

  public async logout(request: Request, response: Response) {
    request.session.destroy((err) => {
      if (err) {
        console.log(err);
        return response.status(500).send(new FailureResult("Something went wrong."));
      }

      return response.status(204).send();
    });
  }

  public async me(_request: Request, response: Response) {
    try {
      const currentUser: IUser = response.locals.user;

      const userMeDto = (({ email, fullName }) => ({ email, fullName }))(currentUser);

      return response.status(200).send(new SuccessResult("Current user fetched successfully", userMeDto));
    } catch (error) {
      console.log(error);
      return response.status(500).send(new FailureResult("Something went wrong."));
    }
  }
}
