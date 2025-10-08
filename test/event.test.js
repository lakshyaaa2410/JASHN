const mongoose = require("mongoose");
const Event = require("../models/eventModel"); // adjust the path if necessary

describe("Event Model Test Suite", () => {
	beforeAll(async () => {
		await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	});

	afterAll(async () => {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	});

	let validEventData;

	beforeEach(() => {
		// Base valid event data
		validEventData = {
			title: "Awesome Event",
			description: "This is an amazing event",
			artist: new mongoose.Types.ObjectId(),
			type: "cypher",
			genre: "Hip-Hop",
			location: "Main Hall",
			city: "Jodhpur",
			poster: "",
			date: new Date(),
			time: { hours: 18, minutes: 30 },
			duration: 120,
			capacity: 100,
			isCompleted: false,
			attendees: [],
		};
	});

	test("should create an event successfully with valid data", async () => {
		const event = new Event(validEventData);
		const savedEvent = await event.save();
		expect(savedEvent._id).toBeDefined();
		expect(savedEvent.title).toBe(validEventData.title);
	});

	// Title tests
	test("should fail if title is missing", async () => {
		delete validEventData.title;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(/Event title is required/);
	});

	test("should fail if title is too short", async () => {
		validEventData.title = "Hi";
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Title must be at least 3 characters/
		);
	});

	test("should fail if title is too long", async () => {
		validEventData.title = "a".repeat(101);
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Title must be less than 100 characters/
		);
	});

	// Description tests
	test("should fail if description is too long", async () => {
		validEventData.description = "a".repeat(501);
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(/Description is too long/);
	});

	// Artist tests
	test("should fail if artist is missing", async () => {
		delete validEventData.artist;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Event must belong to an artist/
		);
	});

	// Type tests
	test("should fail if type is missing", async () => {
		delete validEventData.type;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(/Event type is required/);
	});

	test("should fail if type is invalid", async () => {
		validEventData.type = "party";
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/`party` is not a valid enum value/
		);
	});

	// Location tests
	test("should fail if location is missing", async () => {
		delete validEventData.location;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(/Location is required/);
	});

	// City tests
	test("should fail if city is missing", async () => {
		delete validEventData.city;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(/City is required/);
	});

	// Date tests
	test("should fail if date is missing", async () => {
		delete validEventData.date;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(/Event date is required/);
	});

	// Time tests
	test("should fail if hours are missing", async () => {
		delete validEventData.time.hours;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(/Event hours are required/);
	});

	test("should fail if hours are out of range", async () => {
		validEventData.time.hours = 25;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Hours must be between 0 and 23/
		);
	});

	test("should fail if minutes are missing", async () => {
		delete validEventData.time.minutes;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Event minutes are required/
		);
	});

	test("should fail if minutes are out of range", async () => {
		validEventData.time.minutes = 65;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Minutes must be between 0 and 59/
		);
	});

	// Duration tests
	test("should fail if duration is missing", async () => {
		delete validEventData.duration;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Event duration is required/
		);
	});

	// Capacity tests
	test("should fail if capacity is missing", async () => {
		delete validEventData.capacity;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Event capacity is required/
		);
	});

	test("should fail if capacity < 1", async () => {
		validEventData.capacity = 0;
		const event = new Event(validEventData);
		await expect(event.save()).rejects.toThrow(
			/Capacity must be at least 1/
		);
	});
});
