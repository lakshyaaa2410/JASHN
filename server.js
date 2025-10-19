const express = require("express");
const { connectDB } = require("./database/connection");
const { connectRedis } = require("./database/redisClient");
const cookieParser = require("cookie-parser");

const artistRoutes = require("./routes/artistRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");

const cors = require("cors");
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");

require("dotenv").config();
const app = express();

// Middlewares stack.
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

const rateLimitOptions = rateLimiter({
	windowMs: 60 * 60 * 1000,
	max: 3,
	message: "Too Many Requests, Please Try Again",
});

app.use(rateLimitOptions);

// MongoDB connection.
connectDB();
// connectRedis();

// Routing

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/artist", artistRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users/", userRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Jashn server started on port ${process.env.PORT}`);
});
