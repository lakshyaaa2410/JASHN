const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.route("/register").post(authController.register);
router.route("/verify-otp").post(authController.OTPVerification);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);

router.route("/forgot-password").post(authController.forgotPassword);
module.exports = router;

// TODO: Endpoints

// 2. /forgot-password
// 3. /update-password
