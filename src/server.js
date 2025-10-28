const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const app = require("./app");
const logger = require("./helper/logger");
const swaggerDocs = require("./helper/swagger");

// ------------------------------------ constants -------------------------------------------
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// ------------------------------------ start server -----------------------------------------
if (require.main === module) {
    mongoose
        .connect(DB_URI)
        .then(() => {
            logger.info("DB connected");

            app.listen(PORT, () => {
                logger.info(`App is running at http://localhost:${PORT}`);
                swaggerDocs(app, PORT);
            });
        })
        .catch((err) => {
            logger.error("Could not connect to db", err);
            process.exit(1);
        });
}