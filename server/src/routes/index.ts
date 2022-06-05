import express from "express";
import { SuccessResult } from "../models/result";
import apiRouter from "./api";
const router = express.Router();

router.get("/", (_req: express.Request, res: express.Response) => {
  return res.status(200).json(new SuccessResult("API is up and running!", null));
});

router.use((req, res, next) => {
  console.log(`${new Date().toUTCString()} - ${req.method} ${req.url}`);
  next();
});

router.use("/api", apiRouter);

export default router;
