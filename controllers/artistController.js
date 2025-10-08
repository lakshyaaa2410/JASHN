const Artist = require("../models/artistModel");
const User = require("../models/userModel");

const { HTTPStatusCode } = require("../utilities/httpCodes");

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
