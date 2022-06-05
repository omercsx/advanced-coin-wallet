import express from "express";
import { WalletController } from "../../controllers/wallet";
import { UserRoles } from "../../interfaces/IUser";
import { Auth } from "../../middlewares/auth";

const router = express.Router();
const walletController = new WalletController();

router.get("/", Auth.authenticate, Auth.authorizeRoles([UserRoles.user, UserRoles.admin]), walletController.Get);
router.get(
  "/dashboard",
  Auth.authenticate,
  Auth.authorizeRoles([UserRoles.user, UserRoles.admin]),
  walletController.Dashboard
);

export default router;
