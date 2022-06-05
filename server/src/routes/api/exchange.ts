import express from "express";
import { ExchangeController } from "../../controllers/exchange";
import { UserRoles } from "../../interfaces/IUser";
import { Auth } from "../../middlewares/auth";

const router = express.Router();
const exchangeController = new ExchangeController();

router.post("/create", Auth.authenticate, Auth.authorizeRoles([UserRoles.admin]), exchangeController.Create);
router.post("/refresh", Auth.authenticate, Auth.authorizeRoles([UserRoles.admin]), exchangeController.RefreshSymbols);
router.get("/", Auth.authenticate, exchangeController.List);
router.get("/:exchangeId", Auth.authenticate, exchangeController.GetOne);

export default router;
