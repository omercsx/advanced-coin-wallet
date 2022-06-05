import express from "express";
import authRoutes from "./auth";
import walletRoutes from "./wallet";
import exchangeRoutes from "./exchange";
import userCryptoRoutes from "./userCrypto";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/wallet", walletRoutes);
router.use("/exchange", exchangeRoutes);
router.use("/userCrypto", userCryptoRoutes);

export default router;
