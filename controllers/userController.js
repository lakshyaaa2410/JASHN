const User = require("../models/userModel");
const { HTTPStatusCode } = require("../utilities/httpCodes");

exports.getMe = async function (req, res) {
	try {
		const user = await User.findById(req.user.id).select(
			"-password -otpCode -otpExpires -isVerified -__v"
		);
		return res.status(HTTPStatusCode.OK).json({
			status: "success",
			data: user,
		});
	} catch (err) {
		return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.deactivateMe = async function (req, res) {
	try {
		const user = await User.findById(req.user.id);
		user.isActive = false;

		await user.save({ validateBeforeSave: false });
		return res.status(HTTPStatusCode.OK).json({
			status: "success",
			message: "Account deactivated, login again to activate",
		});
	} catch (err) {
		return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
			status: "failed",
			message: err.message,
		});
	}
};
