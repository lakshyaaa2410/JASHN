const Artist = require("../models/artistModel");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const { HTTPStatusCode } = require("../utilities/httpCodes");

exports.addEvent = async function (req, res) {
	try {
		console.log(req.user.id);

		const artist = await User.findById(req.user.id);
		console.log(artist);

		if (!artist || !artist.isVerified) {
			return res.status(HTTPStatusCode.FORBIDDEN).json({
				status: "fail",
				message: "Please verify your ID to add an Event",
			});
		}

		req.body.artist = req.user._id;

		const event = await Event.create(req.body);

		return res.status(HTTPStatusCode.CREATED).json({
			status: "success",
			data: event,
		});
	} catch (error) {
		return res.status(HTTPStatusCode.BAD_GATEWAY).json({
			status: "failed",
			message: error.message,
		});
	}
};
