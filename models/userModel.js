const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
			minlength: [2, "Must be at least 2 characters"],
			maxlength: [20, "Must be less than 20 characters"],
			match: [/^[A-Za-z]+$/, "Only letters are allowed"],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
			minlength: [2, "Must be at least 2 characters"],
			maxlength: [20, "Must be less than 20 characters"],
			match: [/^[A-Za-z]+$/, "Only letters are allowed"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				"Enter a valid email address",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [8, "Must be at least 8 characters"],
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, "Confirm your password"],
			validate: {
				validator: function (ele) {
					return ele === this.password;
				},
				message: "Passwords do not match",
			},
		},
		role: {
			type: String,
			enum: {
				values: ["user", "artist", "admin"],
				message: "Invalid role",
			},
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		otpCode: String,
		otpExpires: Date,
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(
		this.password,
		Number(process.env.BCRYPT_SALT_ROUNDS)
	);

	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.comparePassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
	const token = crypto.randomBytes(32).toString("hex");
	const hashedToken = crypto
		.createHash("sha256")
		.update(token)
		.digest("base64");

	this.resetPasswordToken = hashedToken;
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return token;
};

module.exports = mongoose.model("User", userSchema);
