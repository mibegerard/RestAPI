const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const catchError = require("./helper/catchError");
const corsMiddleware = require("./config/cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// ------------------------------------ app initialization -----------------------------------
const app = express();

// ------------------------------------ middlewares -----------------------------------------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

// CORS configuration
app.use(corsMiddleware);

// ------------------------------------ dynamic routes ---------------------------------------
const routesDirPath = path.join(__dirname, "routes");

fs.readdirSync(routesDirPath).forEach((file) => {
    const filePath = path.join(routesDirPath, file);
    
    if (fs.statSync(filePath).isFile() && file.endsWith(".js")) {
        app.use("/api", require(filePath));
    }
});

// ------------------------------------ error handling ---------------------------------------
app.use((err, req, res, next) => {
    catchError(err, req, res, next);
});

// ------------------------------------ export ----------------------------------------------
module.exports = app;