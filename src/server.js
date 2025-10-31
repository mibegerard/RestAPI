const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const logger = require('./helper/logger');
const swaggerDocs = require('./helper/swagger');
const connectDB = require('./config/database');

// ------------------------------------ constants -------------------------------------------
const PORT = process.env.PORT || 3000;

// ------------------------------------ start server -----------------------------------------
if (require.main === module) {
  // Initialize database connection
  connectDB()
    .then(() => {
      logger.info('Database connected successfully');

      app.listen(PORT, () => {
        logger.info(`App is running at http://localhost:${PORT}`);
        swaggerDocs(app, PORT);
      });
    })
    .catch((err) => {
      logger.error('Failed to connect to database:', err);
      process.exit(1);
    });
}
