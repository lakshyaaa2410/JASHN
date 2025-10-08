const { createClient } = require("redis");

let redisClient;

exports.connectRedis = async function () {
	if (redisClient) return redisClient;

	redisClient = createClient();
	try {
		await redisClient.connect();
		console.log("Redis Client Connected");
	} catch (error) {
		console.error(error);
	}
};

exports.getRedisClient = function () {
	if (!redisClient) {
		throw new Error("Redis client is not initialized");
	}

	return redisClient;
};
