const User = require("../models/userModel");
const Artist = require("../models/artistModel");

const { HTTPStatusCode } = require("../utilities/httpCodes");
const authUtilities = require("../utilities/authUtilities");

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

exports.logout = async function (req, res) {};

exports.createArtistProfile = async function (req, res) {
	try {
		const user = await User.findById(req.user._id);
		if (!user || user.role !== "artist" || !user.isVerified) {
			return res.status(HTTPStatusCode.FORBIDDEN).json({
				status: "failed",
				message: "Not authorized or user not verified.",
			});
		}

		const artist = await Artist.create({
			user: user._id,
			stageName: req.body.stageName,
			bio: req.body.bio || "",
			location: req.body.location || "",
			socialLinks: req.body.socialLinks || {},
			profileImage: req.body.profileImage || "",
		});

		return res.status(HTTPStatusCode.CREATED).json({
			status: "success",
			data: artist,
		});
	} catch (err) {
		return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
			status: "failed",
			message: err.message,
		});
	}
};
