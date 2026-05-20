const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());

/**
 * Import All routes here
 */
const authRouter = require("./routes/auth.route");

/**
 * Use All routes here
 */
app.use("/auth/api/v1", authRouter);

module.exports = app;
