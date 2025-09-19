const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.route("/userProfile").get(userController.getMe);

module.exports = router;
