const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Event title is required"],
			trim: true,
			maxlength: [100, "Title must be less than 100 characters"],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [1000, "Description too long"],
		},
		date: { type: Date, required: [true, "Event date is required"] },
		location: {
			type: String,
			required: [true, "Location is required"],
			trim: true,
		},
		type: {
			type: String,
			enum: ["show", "cypher"],
			required: [true, "Event type is required"],
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist",
			required: true,
		},
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
