import express from "express";
import { AuthController } from "../../controllers/auth";
import { Auth } from "../../middlewares/auth";

const router = express.Router();
const authController = new AuthController();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/logout").post(Auth.authenticate, authController.logout);
router.route("/me").get(Auth.authenticate, authController.me);

export default router;
