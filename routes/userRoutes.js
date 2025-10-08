const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
	"/getMe",
	authMiddleware.protect,
	authMiddleware.restrictTo("user", "admin"),
	userController.getMe
);

router.post(
	"/deactivateMe",
	authMiddleware.protect,
	authMiddleware.restrictTo("user"),
	userController.deactivateMe
);

module.exports = router;

// TODO: Endpoints
// 1. /updateMe
// 2. /bookings
