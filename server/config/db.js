
const mongoose = require('mongoose');
//mongoose.connect() connects Node.js to your MongoDB database
//process.env.MONGO_URI reads the connection string from your environment variables rather than exposing it in your source code.
//If the connection fails, the server exits instead of pretending the database is available
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
