// Express's import
const express = require("express");
const app = express();
const cors = require("cors");

// Dependency import
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/SwaggerConfig");
require("dotenv").config();

// routes import
const usersRouter = require("./routes/users");

// app usage section
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/doc/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", usersRouter);

module.exports = app;
