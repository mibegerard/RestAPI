const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const catchError = require("./helper/catchError");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// ------------------------------------ app initialization -----------------------------------
const app = express();

// ------------------------------------ middlewares -----------------------------------------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

// CORS configuration
const allowedOrigins = [process.env.ORIGIN, process.env.ORIGIN2].filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    
    next();
});

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