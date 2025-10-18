const User = require("../models/userModel");

const { HTTPStatusCode } = require("../utilities/httpCodes");
const authUtilities = require("../utilities/authUtilities");
const { getRedisClient } = require("../database/redisClient");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utilities/sendMail");
const crypto = require("crypto");

exports.register = async function (req, res) {
	try {
		const newUser = await User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
			role: req.body.role || "user",
		});

		await authUtilities.createAndSendOTP(newUser);

		return res.status(HTTPStatusCode.CREATED).json({
			status: "success",
			message: "OTP sent to email. Please verify",
		});
	} catch (err) {
		return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.OTPVerification = async function (req, res) {
	try {
		const { email, otp } = req.body;

		const user = await User.findOne({
			email,
			otpCode: otp,
			otpExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(HTTPStatusCode.NOT_FOUND).json({
				status: "failed",
				message: "Invalid or expired OTP",
			});
		}

		user.isVerified = true;
		user.otpCode = undefined;
		user.otpExpires = undefined;
		user.passwordConfirm = undefined;

		await user.save({ validateBeforeSave: false });

		// if (user.role == "artist") {
		// 	return res.status(HTTPStatusCode.OK).json({
		// 		status: "success",
		// 		message: "OTP verified. Complete your artist profile now",
		// 	});
		// }

		return res.status(HTTPStatusCode.OK).json({
			status: "success",
			message: "Email verified successfully",
			nextStep: "Login",
		});
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.login = async function (req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(HTTPStatusCode.BAD_REQUEST).json({
				status: "failed",
				message: "Email and password are required ",
			});
		}

		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await user.comparePassword(password))) {
			return res.status(HTTPStatusCode.UNAUTHORIZED).json({
				status: "failed",
				message: "Invalid email or password",
			});
		}

		if (!user.isVerified) {
			return res.status(HTTPStatusCode.FORBIDDEN).json({
				status: "failed",
				message: "Please verify your email before logging in",
			});
		}

		user.isActive = true;
		await user.save({ validateBeforeSave: false });

		authUtilities.createAndSendToken(user, HTTPStatusCode.OK, res);
	} catch (err) {
		return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.logout = async function (req, res) {
	try {
		const token = req.cookies.jwt;
		const decodedToken = jwt.decode(token);
		const expireTime = decodedToken.exp - Math.floor(Date.now() / 1000);

		const redisClient = getRedisClient();

		await redisClient.set(`blacklist:${token}`, "true", {
			EX: expireTime,
		});

		res.clearCookie("jwt", {
			httpOnly: true,
			secure: false,
			sameSite: "Strict",
			path: "/",
		});

		req.user = null;

		return res.status(HTTPStatusCode.OK).json({
			status: "success",
			message: "User Logged Out",
		});
	} catch (error) {
		return res.status(HTTPStatusCode.BAD_GATEWAY).json({
			status: "failed",
			message: error.message,
		});
	}
};

exports.resetPassword = async function (req, res) {
	const { email } = req.body;

	try {
		if (!email) {
			return res.status(HTTPStatusCode.BAD_REQUEST).json({
				status: "failed",
				message: "Please Enter An Email",
			});
		}

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
				status: "failed",
				message: "Something Went Wrong, Please Try Again",
			});
		}

		const newToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = crypto
			.createHash("sha256")
			.update(newToken)
			.digest("hex");

		existingUser.resetPasswordToken = hashedToken;
		existingUser.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

		await existingUser.save({ validateBeforeSave: false });

		const resetLink = `${req.protocol}://${req.get(
			"host"
		)}/reset-password?token=${newToken}&email=${email}`;

		const options = {
			email: email,
			subject: "Jashn - Password Reset",
			html: `<h1>Follow This Link To Reset Your Password.</h1><br><b>${resetLink}</b>`,
		};
		await sendMail(options);

		return res.status(HTTPStatusCode.OK).json({
			status: "success",
			message: "Password reset link has been sent to your email.",
		});
	} catch (error) {
		return res.status(HTTPStatusCode.BAD_GATEWAY).json({
			status: "failed",
			message: error.message,
		});
	}
};
