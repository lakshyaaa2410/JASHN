const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/register").post(authController.register);
router.route("/verify-otp").post(authController.OTPVerification);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);

router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password").patch(authController.resetPassword);

router.post(
	"/update-password",
	authMiddleware.protect,
	authController.updatePassword
);

module.exports = router;

// TODO: Endpoints
// 3. /update-password
