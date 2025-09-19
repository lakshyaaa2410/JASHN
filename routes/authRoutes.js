const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/register").post(authController.register);
router.route("/verify-otp").post(authController.OTPVerification);
router.route("/login").post(authController.login);

router.post(
	"/artist/completeProfile",
	authMiddleware.protect,
	authMiddleware.restrictTo("artist"),
	authController.createArtistProfile
);
module.exports = router;
