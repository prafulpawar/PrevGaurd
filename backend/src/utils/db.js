const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Ensure URL parsing is modern
      useUnifiedTopology: true, // Enable new MongoDB engine
      serverSelectionTimeoutMS: 10000, // Timeout after 10s if no response
      bufferCommands: false, // Disable Mongoose buffering
    });

    console.log("✅ Connected to Database");
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1); // Exit process if DB fails
  }
};

module.exports = connectDB;
