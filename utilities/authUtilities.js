const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendMail } = require("../utilities/sendMail");
const crypto = require("crypto");

const generateToken = function (id) {
	var token = jwt.sign({ id }, process.env.JWT_STRING, {
		expiresIn: "6h",
	});

	return token;
};


exports.createAndSendToken = function (user, statusCode, res) {
	const token = generateToken(user._id);

	const cookieOptions = {
		httpOnly: true,
		secure: false,
		sameSite: "Strict",
		maxAge: 1 * 24 * 60 * 60 * 1000, // 1 Day
		path: "/",
	};

	res.cookie("jwt", token, cookieOptions);
	user.password = undefined;

	return res.status(statusCode).json({
		status: "success",
		token,
		data: user,
	});
};

exports.createAndSendOTP = async function (newUser) {
	// 1.OTP Generation
	const OTP = otpGenerator.generate(6, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});

	// 2.Setting OTP in the schema
	newUser.otpCode = OTP;
	newUser.otpExpires = Date.now() + 5 * 60 * 1000;
	await newUser.save({ validateBeforeSave: false });

	// 3.Sending Mail
	const options = {
		email: newUser.email,
		subject: "Jashn - OTP Verification",
		html: `Your OTP code is <b>${OTP}</b>. It is valid for 5 minutes`,
	};
	await sendMail(options);
};

