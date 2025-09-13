const moongose = require("mongoose");

const artistSchema = new moongose.Schema(
	{
		user: {
			type: moongose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		stageName: {
			type: String,
			required: [true, "Stage name is required"],
			trim: true,
			minlength: [2, "Must be at least 2 characters"],
			maxlength: [20, "Must be less than 20 characters"],
		},
		bio: {
			type: String,
			trim: true,
			maxlength: [500, "Must be less than 500 characters"],
		},
		location: {
			type: String,
			trim: true,
			maxlength: [50, "Must be less than 50 characters"],
		},
		socialLinks: {
			instagram: { type: String, trim: true },
			youtube: { type: String, trim: true },
			spotify: { type: String, trim: true },
		},
		profileImage: { type: String },
	},
	{ timestamps: true }
);

module.exports = moongose.model("Artist", artistSchema);
