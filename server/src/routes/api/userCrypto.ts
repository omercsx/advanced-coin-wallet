import express from "express";
import { UserCryptoController } from "../../controllers/userCrypto";
import { UserRoles } from "../../interfaces/IUser";
import { Auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/", Auth.authenticate, Auth.authorizeRoles([UserRoles.user, UserRoles.admin]), UserCryptoController.Add);
router.patch(
  "/:userCryptoId",
  Auth.authenticate,
  Auth.authorizeRoles([UserRoles.user, UserRoles.admin]),
  UserCryptoController.Update
);
router.delete(
  "/:userCryptoId",
  Auth.authenticate,
  Auth.authorizeRoles([UserRoles.user, UserRoles.admin]),
  UserCryptoController.Delete
);

export default router;
