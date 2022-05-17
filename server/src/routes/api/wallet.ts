import express from "express";
import { WalletController } from "../../controllers/wallet";
import { Auth } from "../../middlewares/auth";

const router = express.Router();
const walletController = new WalletController();

router.get("/", Auth.authenticate, walletController.Get);
router.get("/dashboard", Auth.authenticate, walletController.Dashboard);

export default router;
