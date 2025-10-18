const { HTTPStatusCode } = require("../utilities/httpCodes");
const { promisify } = require("util");
const { getRedisClient } = require("../database/redisClient");

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = async function (req, res, next) {
	try {
		// let token;
		// if (
		// 	req.headers.authorization &&
		// 	req.headers.authorization.startsWith("Bearer")
		// ) {
		// 	token = req.headers.authorization.split(" ")[1];
		// }

		const token = req.cookies?.jwt;
		if (!token) {
			return res.status(HTTPStatusCode.UNAUTHORIZED).json({
				status: "failed",
				message: "You are not logged in, Please try again",
			});
		}

		// 1. Checking If The Token Is Blacklisted
		const redisClient = getRedisClient();
		const isBlacklisted = await redisClient.get(`blacklist:${token}`);

		if (isBlacklisted) {
			return res.status(HTTPStatusCode.UNAUTHORIZED).json({
				status: "failed",
				message: "Invalid Or Expired Token, Please Login Again",
			});
		}

		// 2. Verification of token
		const decodedPayload = await promisify(jwt.verify)(
			token,
			process.env.JWT_STRING
		);

		const freshUser = await User.findById(decodedPayload.id);
		if (!freshUser) {
			return res.status(HTTPStatusCode.UNAUTHORIZED).json({
				status: "failed",
				message: "The user belonging to this token does not exsists",
			});
		}

		req.user = freshUser;
		next();
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.restrictTo = function (...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(HTTPStatusCode.UNAUTHORIZED).json({
				status: "failed",
				message:
					"You do not have the permission to perform this action",
			});
		}
		next();
	};
};
