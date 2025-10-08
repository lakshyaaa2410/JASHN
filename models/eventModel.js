const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Event title is required"],
		trim: true,
		minlength: [3, "Title must be at least 3 characters"],
		maxlength: [100, "Title must be less than 100 characters"],
	},
	description: {
		type: String,
		trim: true,
		maxlength: [500, "Description is too long"],
	},
	artist: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Artist",
		required: [true, "Event must belong to an artist"],
	},
	type: {
		type: String,
		enum: ["cypher", "show", "event", "concert", "battle"],
		required: [true, "Event type is required"],
	},
	genre: {
		type: String,
		trim: true,
		default: "Hip-Hop",
	},
	location: {
		type: String,
		required: [true, "Location is required"],
		trim: true,
	},
	city: {
		type: String,
		required: [true, "City is required"],
		trim: true,
	},
	poster: {
		type: String,
		default: "",
	},
	date: {
		type: Date,
		required: [true, "Event date is required"],
	},
	time: {
		hours: {
			type: Number,
			required: [true, "Event hours are required"],
			min: [0, "Hours must be between 0 and 23"],
			max: [23, "Hours must be between 0 and 23"],
		},
		minutes: {
			type: Number,
			required: [true, "Event minutes are required"],
			min: [0, "Minutes must be between 0 and 59"],
			max: [59, "Minutes must be between 0 and 59"],
		},
	},

	duration: {
		type: Number,
		required: [true, "Event duration is required"],
	},
	capacity: {
		type: Number,
		required: [true, "Event capacity is required"],
		min: [1, "Capacity must be at least 1"],
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
	attendees: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Event", eventSchema);
