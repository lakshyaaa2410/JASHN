const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
	"/addEvent",
	authMiddleware.protect,
	authMiddleware.restrictTo("artist"),
	eventController.addEvent
);

module.exports = router;
