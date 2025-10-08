const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/register").post(authController.register);
router.route("/verify-otp").post(authController.OTPVerification);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);

module.exports = router;

// TODO: Endpoints

// 1. /reset-password
// 2. /forgot-password
// 3. /update-password
// 4. /logout -- Done
