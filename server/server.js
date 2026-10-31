//dotenv loads the settings from your .env file.
//connectDB() attempts to connect to MongoDB Atlas
//If the connection succeeds, Express starts listening for requests.
//If the connection fails, the error handler in db.js exits the application.
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TaskFlow API running at http://localhost:${PORT}`);
  });
};

startServer();
