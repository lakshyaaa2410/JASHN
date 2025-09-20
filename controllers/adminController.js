const User = require("../models/userModel");
const Artist = require("../models/artistModel");
const { HTTPStatusCode } = require("../utilities/httpCodes");

exports.getUsersByStatus = async function (req, res) {
	try {
		const { status } = req.query;

		const statusMap = { active: true, inactive: false };
		const isActive = statusMap[status];

		if (isActive === undefined) {
			return res.status(HTTPStatusCode.BAD_REQUEST).json({
				status: "failed",
				message: "Invalid status",
			});
		}

		const users = await User.find({ isActive, role: "user" });
		return res.status(HTTPStatusCode.OK).json({
			status: "success",
			length: users.length,
			data: users,
		});
	} catch (err) {
		return res.status(HTTPStatusCode.BAD_REQUEST).json({
			status: "failed",
			message: err.message,
		});
	}
};
