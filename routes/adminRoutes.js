const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

router.get(
	"/getUsersByStatus",
	authMiddleware.protect,
	authMiddleware.restrictTo("admin"),
	adminController.getUsersByStatus
);

router.get(
	"/getAllUsers",
	authMiddleware.protect,
	authMiddleware.restrictTo("admin"),
	adminController.getAllUsers
);

router.get(
	"/getAllArtists",
	authMiddleware.protect,
	authMiddleware.restrictTo("admin"),
	adminController.getAllArtists
);

module.exports = router;
