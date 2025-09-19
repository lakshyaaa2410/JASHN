const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		stageName: {
			type: String,
			required: [true, "Stage name is required"],
			trim: true,
			minlength: [2, "Minimum 2 characters"],
			maxlength: [30, "Maximum 30 characters"],
		},
		bio: {
			type: String,
			trim: true,
			maxlength: [500, "Bio cannot exceed 500 characters"],
		},
		location: {
			type: String,
			trim: true,
			maxlength: [100, "Location must be under 100 characters"],
		},
		socialLinks: {
			instagram: { type: String, trim: true },
			youtube: { type: String, trim: true },
			spotify: { type: String, trim: true },
			other: { type: String, trim: true },
		},
		profileImage: {
			type: String,
			default: "default-artist.png",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);
