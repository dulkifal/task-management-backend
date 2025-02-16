const mongoose = require('mongoose');
// import dotenv
require('dotenv').config();

const { MONGO_URI } = process.env;


/**
 * Connects to the MongoDB database.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;