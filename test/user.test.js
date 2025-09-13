const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/userModel"); // adjust path if needed

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
});

describe("User model validation", () => {
	const validUser = {
		firstName: "John",
		lastName: "Doe",
		email: "john@example.com",
		password: "password123",
		passwordConfirm: "password123",
	};

	it("should save a valid user", async () => {
		const user = new User(validUser);
		await expect(user.save()).resolves.toBeDefined();
	});

	it("should require firstName", async () => {
		const user = new User({ ...validUser, firstName: undefined });
		await expect(user.save()).rejects.toThrow(/first name.*required/i);
	});

	it("should enforce firstName min length", async () => {
		const user = new User({ ...validUser, firstName: "A" });
		await expect(user.save()).rejects.toThrow(/at least 2 characters/i);
	});

	it("should enforce firstName max length", async () => {
		const user = new User({ ...validUser, firstName: "A".repeat(21) });
		await expect(user.save()).rejects.toThrow(/less than 20 characters/i);
	});

	it("should allow only letters in firstName", async () => {
		const user = new User({ ...validUser, firstName: "John123" });
		await expect(user.save()).rejects.toThrow(/only letters are allowed/i);
	});

	it("should validate email format", async () => {
		const user = new User({ ...validUser, email: "invalid-email" });
		await expect(user.save()).rejects.toThrow(
			/enter a valid email address/i
		);
	});

	it("should ensure passwordConfirm matches password", async () => {
		const user = new User({
			...validUser,
			passwordConfirm: "wrongpassword",
		});
		await expect(user.save()).rejects.toThrow(/passwords do not match/i);
	});

	it("should enforce valid role", async () => {
		const user = new User({ ...validUser, role: "superadmin" });
		await expect(user.save()).rejects.toThrow(/invalid role/i);
	});
});
