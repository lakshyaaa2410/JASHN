const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
	"/me",
	authMiddleware.protect,
	authMiddleware.restrictTo("user"),
	userController.getMe
);

router.post(
	"/deactivateMe",
	authMiddleware.protect,
	authMiddleware.restrictTo("user"),
	userController.deactivateMe
);

module.exports = router;
