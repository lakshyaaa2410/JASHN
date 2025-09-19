const User = require("../models/userModel");
const { HTTPStatusCode } = require("../utilities/httpCodes");

exports.getMe = async function (req, res) {
	try {
		const user = await User.findById(req.user.id);
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
