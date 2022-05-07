import express from "express";
import { UserCryptoController } from "../../controllers/userCrypto";
import { Auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/", Auth.authenticate, UserCryptoController.Add);
router.patch("/:userCryptoId", Auth.authenticate, UserCryptoController.Update);
router.delete("/:userCryptoId", Auth.authenticate, UserCryptoController.Delete);

export default router;
