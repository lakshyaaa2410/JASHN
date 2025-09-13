const express = require("express");
const { connectDB } = require("./database/connection");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middlewares stack.
app.use(cors());
app.use(express.json());

// MongoDB connection.
// connectDB();

app.listen(process.env.PORT, () => {
	console.log(`Jashn server started on port ${process.env.PORT}`);
});
