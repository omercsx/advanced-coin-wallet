import express from "express";
import { AuthController } from "../../controllers/auth";
import { UserRoles } from "../../interfaces/IUser";
import { Auth } from "../../middlewares/auth";

const router = express.Router();
const authController = new AuthController();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router
  .route("/logout")
  .post(Auth.authenticate, Auth.authorizeRoles([UserRoles.user, UserRoles.admin]), authController.logout);
router.route("/me").get(Auth.authenticate, Auth.authorizeRoles([UserRoles.user, UserRoles.admin]), authController.me);

export default router;
