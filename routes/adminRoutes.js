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

module.exports = router;
