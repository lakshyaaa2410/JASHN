const mongoDB = require("mongoose");

exports.connectDB = async function (req, res) {
	try {
		const connetion = await mongoDB.connect(
			process.env.MONGO_DB_CONNECTION_STRING
		);
		console.log(`MongoDB connected: ${connetion.connection.port}`);
	} catch (err) {
		console.log(err);
	}
};
