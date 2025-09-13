const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/userModel");
const Artist = require("../models/artistModel");

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
});

describe("Artist model validation and relations", () => {
	const validUserData = {
		firstName: "John",
		lastName: "Doe",
		email: "john@example.com",
		password: "password123",
		passwordConfirm: "password123",
	};

	it("should fail saving Artist without a valid user reference", async () => {
		const artist = new Artist({ stageName: "DJ Test" });
		await expect(artist.save()).rejects.toThrow(/user.*required/i);
	});

	it("should save Artist with valid user reference and valid fields", async () => {
		const user = await User.create(validUserData);

		const artist = new Artist({
			user: user._id,
			stageName: "DJ Valid",
			bio: "This is a bio",
			location: "New York",
			socialLinks: {
				instagram: "https://instagram.com/test",
				youtube: "https://youtube.com/test",
			},
			profileImage: "image.jpg",
		});

		await expect(artist.save()).resolves.toBeDefined();
	});

	it("should validate Artist stageName min and max length", async () => {
		const user = await User.create(validUserData);

		const artistShort = new Artist({ user: user._id, stageName: "A" });
		const artistLong = new Artist({
			user: user._id,
			stageName: "A".repeat(21),
		});

		await expect(artistShort.save()).rejects.toThrow(
			/at least 2 characters/i
		);
		await expect(artistLong.save()).rejects.toThrow(
			/less than 20 characters/i
		);
	});

	it("should validate Artist bio max length", async () => {
		const user = await User.create(validUserData);

		const artist = new Artist({
			user: user._id,
			stageName: "DJ BioTest",
			bio: "A".repeat(501),
		});

		await expect(artist.save()).rejects.toThrow(
			/less than 500 characters/i
		);
	});

	it("should validate Artist location max length", async () => {
		const user = await User.create(validUserData);

		const artist = new Artist({
			user: user._id,
			stageName: "DJ LocationTest",
			location: "B".repeat(51),
		});

		await expect(artist.save()).rejects.toThrow(/less than 50 characters/i);
	});

	it("should save multiple Artists with same valid user", async () => {
		const user = await User.create(validUserData);

		const artist1 = new Artist({ user: user._id, stageName: "DJ One" });
		const artist2 = new Artist({ user: user._id, stageName: "DJ Two" });

		await expect(artist1.save()).resolves.toBeDefined();
		await expect(artist2.save()).resolves.toBeDefined();
	});
});
