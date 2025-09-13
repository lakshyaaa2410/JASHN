const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const User = require("../models/userModel");
const Artist = require("../models/artistModel");
const Event = require("../models/eventModel");

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

afterEach(async () => {
	await User.deleteMany();
	await Artist.deleteMany();
	await Event.deleteMany();
});

describe("Event model validation", () => {
	const validUserData = {
		firstName: "John",
		lastName: "Doe",
		email: "john@example.com",
		password: "password123",
		passwordConfirm: "password123",
	};

	const validArtistData = {
		stageName: "DJ Test",
		user: null, // will be set after creating User
	};

	it("should require title", async () => {
		const user = await User.create(validUserData);
		const artist = await Artist.create({
			...validArtistData,
			user: user._id,
		});

		const event = new Event({
			date: new Date(),
			location: "New York",
			type: "show",
			createdBy: artist._id,
		});

		await expect(event.save()).rejects.toThrow(/event title is required/i);
	});

	it("should enforce title max length", async () => {
		const user = await User.create(validUserData);
		const artist = await Artist.create({
			...validArtistData,
			user: user._id,
		});

		const event = new Event({
			title: "A".repeat(101),
			date: new Date(),
			location: "New York",
			type: "show",
			createdBy: artist._id,
		});

		await expect(event.save()).rejects.toThrow(
			/title must be less than 100 characters/i
		);
	});

	it("should enforce description max length", async () => {
		const user = await User.create(validUserData);
		const artist = await Artist.create({
			...validArtistData,
			user: user._id,
		});

		const event = new Event({
			title: "Cool Event",
			description: "A".repeat(1001),
			date: new Date(),
			location: "New York",
			type: "show",
			createdBy: artist._id,
		});

		await expect(event.save()).rejects.toThrow(/description too long/i);
	});

	it("should require date", async () => {
		const user = await User.create(validUserData);
		const artist = await Artist.create({
			...validArtistData,
			user: user._id,
		});

		const event = new Event({
			title: "Cool Event",
			location: "New York",
			type: "show",
			createdBy: artist._id,
		});

		await expect(event.save()).rejects.toThrow(/event date is required/i);
	});

	it("should require location", async () => {
		const user = await User.create(validUserData);
		const artist = await Artist.create({
			...validArtistData,
			user: user._id,
		});

		const event = new Event({
			title: "Cool Event",
			date: new Date(),
			type: "show",
			createdBy: artist._id,
		});

		await expect(event.save()).rejects.toThrow(/location is required/i);
	});

	it("should require type", async () => {
		const user = await User.create(validUserData);
		const artist = await Artist.create({
			...validArtistData,
			user: user._id,
		});

		const event = new Event({
			title: "Cool Event",
			date: new Date(),
			location: "New York",
			createdBy: artist._id,
		});

		// missing type → required validation
		await expect(event.save()).rejects.toThrow(/event type is required/i);
	});

	it("should enforce type enum", async () => {
		const user = await User.create(validUserData);
		const artist = await Artist.create({
			...validArtistData,
			user: user._id,
		});

		const event = new Event({
			title: "Cool Event",
			date: new Date(),
			location: "New York",
			type: "party", // invalid enum
			createdBy: artist._id,
		});

		await expect(event.save()).rejects.toThrow(
			/is not a valid enum value/i
		);
	});

	it("should require createdBy", async () => {
		const event = new Event({
			title: "Cool Event",
			date: new Date(),
			location: "New York",
			type: "show",
		});

		await expect(event.save()).rejects.toThrow(/createdby.*required/i);
	});

	it("should save successfully with valid data and participants", async () => {
		const user1 = await User.create(validUserData);
		const user2 = await User.create({
			...validUserData,
			email: "user2@example.com",
		});
		const artist = await Artist.create({
			...validArtistData,
			user: user1._id,
		});

		const event = new Event({
			title: "Cool Event",
			description: "This is an amazing event",
			date: new Date(),
			location: "New York",
			type: "show",
			createdBy: artist._id,
			participants: [user1._id, user2._id],
		});

		await expect(event.save()).resolves.toBeDefined();
	});
});
